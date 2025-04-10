"use client"
import CustomLoader from "@/app/_components/CustomLoader"
import StoryLastPage from "@/app/_components/story/StoryLastPage"
import StoryPages from "@/app/_components/story/StoryPages"
import SkinColor from "@/app/_components/story/controls/SkinColor"
import { FieldData } from "@/app/_components/story/controls/types"
import { generateImage } from "@/app/_utils/api"
import { getStory, StoryItem, updateStory } from "@/app/_utils/db"
import { getImageData } from "@/app/_utils/imageUtils"
import {
  getStoryCoverImagePrompt,
  getConsistentPrompt,
} from "@/app/_utils/storyUtils"
import { chapterNewTextPrompt, chapterSession } from "@/config/GeminiAi"
import { Chapter } from "@/config/schema"
import { Divider, Button } from "@nextui-org/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"

import ChapterEditor from "./_components/ChapterEditor"
import ImageEditorControl from "./_components/ImageEditorControl"
import TakePhoto from "@/app/create-story/_components/TakePhoto"
import ImageInput from "@/app/create-story/_components/ImageInput"

interface PageParams {
  id: string
}

export default function ViewStory({ params }: { params: PageParams }) {
  const [story, setStory] = useState<StoryItem | null>(null)
  const [skinColor, setSkinColor] = useState<string | undefined>()
  const [selectedCoverInput, setSelectedCoverInput] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)

  const notify = (msg: string) => toast(msg)
  const notifyError = (msg: string) => toast.error(msg)

  const initStory = async () => {
    try {
      setLoading(true)
      const story = await getStory(params.id)
      setStory(story)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initStory()
  }, [])

  const onSkinColorChange = useCallback((field: FieldData) => {
    setSkinColor(field.fieldValue as string)
  }, [])

  const regenerateCoverImage = useCallback(
    async ({ seedImage, skinColor }: { seedImage?: File | string; skinColor?: string }) => {
      if (!story) return

      try {
        const processedSeed =
          seedImage ? await getImageData(seedImage) : story.output.seedImageUrl

        const prompt = getStoryCoverImagePrompt({
          story,
          gaiStory: story.output,
          seedImage: processedSeed,
        })

        const { imageUrl, seedImageUrl } = await generateImage({
          prompt,
          seedImage: processedSeed,
          skinColor,
        })

        story.coverImage = imageUrl
        story.output.seedImageUrl = seedImageUrl

        setStory({ ...story })
        await updateStory(story.id, {
          output: story.output,
          coverImage: imageUrl,
          skinColor,
        })

        notify("Cover image regenerated!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to regenerate cover image")
      }
    },
    [story]
  )

  const regenerateChapterImage = useCallback(
    async ({
      chapter,
      seedImage,
      skinColor,
      imagePrompt,
    }: {
      chapter: Chapter
      seedImage?: File | string
      skinColor?: string
      imagePrompt?: string
    }) => {
      if (!story) return

      try {
        const chapterIndex = story.output.chapters.findIndex(
          (x) => x.chapter_title === chapter.chapter_title
        )

        const processedSeed = seedImage
          ? await getImageData(seedImage)
          : story.output.seedImageUrl

        const resolvedSkinColor =
          skinColor ??
          story.output.chapters[chapterIndex]?.skin_color ??
          story.skinColor

        const basePrompt = imagePrompt ?? chapter.image_prompt ?? ""
        const prompt = getConsistentPrompt(basePrompt, resolvedSkinColor)

        const { imageUrl } = await generateImage({
          prompt,
          seedImage: processedSeed,
          skinColor: resolvedSkinColor,
        })

        story.output.chapters[chapterIndex] = {
          ...story.output.chapters[chapterIndex],
          chapter_image: imageUrl,
          image_prompt: prompt,
          skin_color: resolvedSkinColor,
        }

        setStory({ ...story })
        await updateStory(story.id, { output: story.output })
        notify("Chapter image updated!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to regenerate chapter image")
      }
    },
    [story]
  )

  const regenerateChapterText = useCallback(
    async (chapter: Chapter) => {
      if (!story) return

      try {
        const chapterIndex = story.output.chapters.findIndex(
          (x) => x.chapter_title === chapter.chapter_title
        )

        const storyParts = story.output.chapters.map((x) => ({
          title: x.chapter_title,
          text: x.chapter_text,
        }))

        const result = await chapterSession.sendMessage(
          chapterNewTextPrompt(chapterIndex, storyParts)
        )

        const output = JSON.parse(result.response.text())

        story.output.chapters[chapterIndex] = {
          ...story.output.chapters[chapterIndex],
          chapter_title: output.title,
          chapter_text: output.text,
        }

        setStory({ ...story })
        await updateStory(story.id, { output: story.output })
        notify("Chapter text updated!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to regenerate text")
      }
    },
    [story]
  )

  const saveChapterTextChanges = useCallback(
    async (chapter: Chapter, text: string) => {
      if (!story) return

      try {
        const chapterIndex = story.output.chapters.findIndex(
          (x) => x.chapter_title === chapter.chapter_title
        )

        story.output.chapters[chapterIndex] = {
          ...story.output.chapters[chapterIndex],
          chapter_text: text,
        }

        setStory({ ...story })
        await updateStory(story.id, { output: story.output })
        notify("Chapter text saved")
      } catch (e) {
        console.error(e)
        notifyError("Failed to save text")
      }
    },
    [story]
  )

  const storyPages = useMemo(() => {
    if (!story) return []

    return story.output.chapters.map((chapter, index) => (
      <div
        key={`chapter-${index + 1}`}
        className="flex flex-col gap-2 bg-white p-4 max-w-screen-md"
      >
        <span className="font-bold text-4xl text-primary">Chapter {index + 1}</span>
        <ChapterEditor
          story={story}
          chapter={chapter}
          regenerateImage={regenerateChapterImage}
        />
        <Divider />
        <StoryPages
          storyId={story.id}
          chapter={chapter}
          chapterNumber={index}
          isEditable
          regenerateText={regenerateChapterText}
          saveTextChanges={saveChapterTextChanges}
        />
      </div>
    ))
  }, [story, regenerateChapterImage, regenerateChapterText, saveChapterTextChanges])

  const bookPages = useMemo(() => {
    if (!story) return []

    return [
      <div key={0} className="flex flex-col gap-2 bg-white p-4 max-w-screen-md">
        <span className="font-bold text-4xl text-primary">Cover image</span>
        <div className="grid grid-cols-2 gap-2">
          <ImageInput
            userSelection={({ fieldValue }) =>
              setSelectedCoverInput(fieldValue as File)
            }
          />
          <TakePhoto
            userSelection={({ fieldValue }) =>
              setSelectedCoverInput(fieldValue as File)
            }
          />
        </div>
        <Button
          className="mt-2 w-fit"
          color="primary"
          onClick={() =>
            regenerateCoverImage({
              seedImage: selectedCoverInput!,
              skinColor,
            })
          }
          isDisabled={!selectedCoverInput}
        >
          Update Cover Image
        </Button>
      </div>,
      ...storyPages,
      <div key={story.output.chapters.length + 1}>
        <StoryLastPage story={story} />
      </div>,
    ]
  }, [story, storyPages, regenerateCoverImage, skinColor, selectedCoverInput])

  const title = story?.output.story_cover.title ?? ""

  return (
    <>
      {!loading && (
        <div className="p-10 md:px-20 lg:px-40 flex flex-col gap-4 min-h-screen">
          <h2 className="font-bold text-4xl text-center p-10 bg-primary text-white">
            {title}
          </h2>

          {story && (
            <div className="flex justify-center">
              <div className="flex flex-col lg:flex-row gap-2 max-w-screen-lg">
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-4xl text-primary">
                    1. Edit images
                  </span>
                  <ImageEditorControl
                    story={story}
                    onRegenerate={() =>
                      regenerateCoverImage({ skinColor })
                    }
                    generateTxt="Regenerate all images"
                    withAction
                  />
                </div>
                <SkinColor
                  value={skinColor ?? story.skinColor}
                  userSelection={onSkinColorChange}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col justify-center items-center gap-4 mt-10">
            {bookPages}
          </div>
        </div>
      )}
      <CustomLoader isLoading={loading} />
    </>
  )
}
