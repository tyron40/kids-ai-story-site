"use client"
import {
  FormDataType,
  UserSelectionHandler,
} from "@/app/_components/story/controls/types"
import { useUser } from "@clerk/nextjs"
import { chatSession, GAIStoryData, isStoryData } from "@/config/GeminiAi"
import { db } from "@/config/db"
import { Users } from "@/config/schema"
import { Button } from "@nextui-org/button"
import { eq } from "drizzle-orm"
import { useRouter } from "next/navigation"
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { v4 as uuidv4 } from "uuid"

import CustomLoader from "../_components/CustomLoader"
import SkinColor from "../_components/story/controls/SkinColor"
import { UserDetailContext } from "../_context/UserDetailConext"
import { generateImage } from "../_utils/api"
import { createStory } from "../_utils/db"
import { getImageData } from "../_utils/imageUtils"
import { getBasePrompt, getStoryPrompt } from "../_utils/storyUtils"
import AgeGroup from "./_components/AgeGroup"
import ImageInput from "./_components/ImageInput"
import ImageStyle from "./_components/ImageStyle"
import StorySubjectInput from "./_components/StorySubjectInput"
import StoryType from "./_components/StoryType"
import TotalChaptersSelect from "./_components/TotalChaptersSelect"

const defaultFormData: FormDataType = {
  storySubject: "",
  storyType: "",
  imageStyle: "",
  ageGroup: "",
  skinColor: null,
  totalChapters: 5,
  seedImage: null,
}

export default function CreateStory() {
  const router = useRouter()
  const { user } = useUser()
  const { userDetail } = useContext(UserDetailContext)
  const [formData, setFormData] = useState(defaultFormData)
  const [loading, setLoading] = useState(false)

  const notify = (msg: string) => toast(msg)
  const notifyError = (msg: string) => toast.error(msg)

  const onHandleUserSelection: UserSelectionHandler = (data) => {
    setFormData((prev) => ({
      ...prev,
      [data.fieldName]: data.fieldValue,
    }))
  }

  const saveStory = async (output: GAIStoryData, imageUrl: string) => {
    const recordId = uuidv4()
    return createStory({
      storyId: recordId,
      ageGroup: formData.ageGroup,
      imageStyle: formData.imageStyle,
      skinColor: formData.skinColor,
      storySubject: formData.storySubject,
      storyType: formData.storyType,
      output,
      coverImage: imageUrl,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
      userImage: user?.imageUrl ?? null,
      userName: user?.username ?? null,
    })
  }

  const updateUserCredits = async () => {
    await db
      .update(Users)
      .set({
        credit: Number(userDetail!.credit! - 1),
      })
      .where(eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress ?? ""))
      .returning({ id: Users.id })
  }

  const onGenerateStoryData = async () => {
    const storyPrompt = getStoryPrompt(formData)
    const result = await chatSession.sendMessage(storyPrompt)

    const story = JSON.parse(
      result?.response.text().replace(/(})(,?)(\n *\})/g, "$1,")
    )

    if (!isStoryData(story)) {
      throw new Error("Generated data is invalid")
    }

    return story
  }

  const onGenerateStory = async () => {
    if (userDetail!.credit! <= 0) {
      notifyError("You dont have enough credits!")
      return
    }

    try {
      setLoading(true)

      const story = await onGenerateStoryData()

      const seedImage =
        formData.seedImage !== null
          ? await getImageData(formData.seedImage)
          : null

      const coverImagePromptParts = seedImage
        ? [formData.storySubject, formData.imageStyle]
        : [
            getBasePrompt(
              story.story_cover.title,
              story.story_cover.image_prompt
            ),
          ]

      const coverImagePrompt = coverImagePromptParts
        .filter((x) => !!x)
        .join(", ")

      const { imageUrl: coverImageUrl, seedImageUrl } = await generateImage({
        prompt: coverImagePrompt,
        seedImage,
        skinColor: formData.skinColor,
      })

      // generate chapter images
      for (let index = 0; index < story.chapters.length; index++) {
        const chapter = story.chapters[index]
        if (chapter.image_prompt) {
          const { imageUrl } = await generateImage({
            prompt: chapter.image_prompt,
            seedImage: seedImageUrl,
            skinColor: formData.skinColor,
          })
          story.chapters[index].chapter_image = imageUrl
        }
      }

      const [created] = await saveStory(
        {
          ...story,
          seedImageUrl,
        },
        coverImageUrl
      )

      notify("Story generated")
      await updateUserCredits()
      router.replace("/view-story/" + created.storyId)
    } catch (e) {
      console.error(e)
      notifyError("Something went wrong, please try again!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-10 md:px-20 lg:px-40">
      <h2 className="font-extrabold text-[70px] text-primary text-center">
        CREATE YOUR STORY
      </h2>
      <p className="text-2xl text-primary text-center">
        Unlock your creativity with AI: Craft stories like never before!Let our
        AI bring your imagination to life, one story at a time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14 max-w-screen-2xl justify-self-center">
        <div className="grid grid-cols-2 gap-2">
          <StorySubjectInput userSelection={onHandleUserSelection} />
          <ImageInput userSelection={onHandleUserSelection} />
        </div>
        <SkinColor userSelection={onHandleUserSelection} />
        <StoryType userSelection={onHandleUserSelection} />
        <AgeGroup userSelection={onHandleUserSelection} />
        <ImageStyle userSelection={onHandleUserSelection} />
        <TotalChaptersSelect userSelection={onHandleUserSelection} />
      </div>

      <div className="flex justify-end my-10 flex-col items-end">
        <Button
          color="primary"
          disabled={loading}
          className="p-8 text-2xl"
          onPress={onGenerateStory}
        >
          Generate Story
        </Button>
        <span className="mt-2">1 Credit will be used</span>
      </div>
      <CustomLoader isLoading={loading} />
    </div>
  )
}
