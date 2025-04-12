"use client"
import CustomLoader from "@/app/_components/CustomLoader"
import StoryLastPage from "@/app/_components/story/StoryLastPage"
import StoryPages from "@/app/_components/story/StoryPages"
import SkinColor from "@/app/_components/story/controls/SkinColor"
import { FieldData } from "@/app/_components/story/controls/types"
import { generateImage } from "@/app/_utils/api"
import { getStory, StoryItem, updateStory } from "@/app/_utils/db"
import { getImageData } from "@/app/_utils/imageUtils"
import { getStoryCoverImagePrompt } from "@/app/_utils/storyUtils"
import { chapterNewTextPrompt, chapterSession } from "@/config/GeminiAi"
import { Chapter } from "@/config/schema"
import { Divider } from "@nextui-org/react"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"

import ChapterEditor from "./_components/ChapterEditor"
import CoverImageEditor from "./_components/CoverImageEditor"
import ImageEditorControl from "./_components/ImageEditorControl"
import {
  RegenerateChapterImageParams,
  RegenerateImageParams,
} from "./_components/types"

interface PageParams {
  id: string
}

export default function ViewStory({ params }: { params: PageParams }) {
  const [story, setStory] = useState<StoryItem | null>(null)

  const [skinColor, setSkinColor] = useState<string | undefined>()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSkinColorChange = useCallback((field: FieldData) => {
    setSkinColor(field.fieldValue as string)
  }, [])

  const regenerateCoverImage = useCallback(
    async ({ seedImage, skinColor, imagePrompt }: RegenerateImageParams) => {
      if (!story) {
        return
      }

      try {
        if (seedImage) {
          seedImage = await getImageData(seedImage)
        }

        const prompt =
          imagePrompt ??
          getStoryCoverImagePrompt({
            story,
            gaiStory: story.output,
            seedImage: story.output.seedImageUrl,
          })

        const { imageUrl } = await generateImage({
          prompt,
          seedImage: seedImage ?? story.output.seedImageUrl,
          skinColor,
        })

        story.coverImage = imageUrl

        setStory({
          ...story,
        })
        await updateStory(story.id, { coverImage: imageUrl })

        notify("Cover image regenerated successfully!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to regenerate cover image, please try again.")
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
    }: RegenerateChapterImageParams) => {
      if (!story) {
        return
      }

      try {
        const chapterIndex = story.output.chapters.findIndex(
          (x) => x.chapter_title === chapter.chapter_title
        )

        if (seedImage) {
          seedImage = await getImageData(seedImage)
        }

        const prompt = imagePrompt ?? chapter.image_prompt
        skinColor =
          skinColor ??
          story.output.chapters[chapterIndex].skin_color ??
          story.skinColor

        const { imageUrl } = await generateImage({
          prompt,
          seedImage: seedImage ?? story.output.seedImageUrl,
          skinColor,
        })

        story.output.chapters[chapterIndex] = {
          ...story.output.chapters[chapterIndex],
          chapter_image: imageUrl,
          image_prompt: prompt,
          skin_color: skinColor,
        }

        setStory({
          ...story,
        })

        await updateStory(story.id, { output: story.output })

        notify("Chapter image regenerated successfully!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to regenerate chapter image, please try again.")
      }
    },
    [story]
  )

  const regenerateChapterText = useCallback(
    async (chapter: Chapter) => {
      if (!story) {
        return
      }

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

        setStory({
          ...story,
        })

        await updateStory(story.id, { output: story.output })

        notify("Chapter text regenerated successfully!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to regenerate chapter text, please try again.")
      }
    },
    [story]
  )

  const regenerateAllImages = useCallback(
    async (seedImage?: File | string) => {
      if (!story) {
        return
      }

      try {
        setLoading(true)

        if (seedImage) {
          seedImage = await getImageData(seedImage)
        }

        const prompt = getStoryCoverImagePrompt({
          story,
          gaiStory: story.output,
          seedImage: seedImage ?? story.output.seedImageUrl,
        })

        const { imageUrl: coverImageUrl, seedImageUrl } = await generateImage({
          prompt,
          seedImage: seedImage ?? story.output.seedImageUrl,
          skinColor,
        })

        story.coverImage = coverImageUrl
        story.output.seedImageUrl = seedImageUrl

        // generate chapter images
        for (let index = 0; index < story.output.chapters.length; index++) {
          const chapter = story.output.chapters[index]
          if (chapter.image_prompt) {
            const { imageUrl } = await generateImage({
              prompt: chapter.image_prompt,
              seedImage: seedImageUrl,
              skinColor,
            })
            story.output.chapters[index].chapter_image = imageUrl
          }
        }

        await updateStory(story.id, {
          output: story.output,
          coverImage: coverImageUrl,
          skinColor,
        })

        setStory({ ...story })

        notify("Images regenerated successfully!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to regenerate images, please try again.")
      } finally {
        setLoading(false)
      }
    },
    [story, skinColor]
  )

  const saveChapterTextChanges = useCallback(
    async (chapter: Chapter, text: string) => {
      if (!story) {
        return
      }

      try {
        const chapterIndex = story.output.chapters.findIndex(
          (x) => x.chapter_title === chapter.chapter_title
        )

        story.output.chapters[chapterIndex] = {
          ...story.output.chapters[chapterIndex],
          chapter_text: text,
        }

        setStory({
          ...story,
        })

        await updateStory(story.id, { output: story.output })

        notify("Chapter text saved successfully!")
      } catch (e) {
        console.error(e)
        notifyError("Failed to save chapter text, please try again.")
      }
    },
    [story]
  )

  const storyPages = useMemo(() => {
    if (!story) {
      return []
    }

    const totalChapters = story.output.chapters.length

    let pages: (React.JSX.Element | React.JSX.Element[])[] = []

    if (totalChapters > 0) {
      pages = [...Array(totalChapters)].map((_, index) => {
        const chapter = story.output.chapters[index]
        return (
          <div
            key={`chapter-${index + 1}-img`}
            className="flex flex-col gap-2 bg-white p-4 max-w-screen-md"
          >
            <span className="font-bold text-4xl text-primary">
              Chapter {index + 1}
            </span>
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
        )
      })
    }

    return pages
  }, [
    story,
    regenerateChapterImage,
    regenerateChapterText,
    saveChapterTextChanges,
  ])

  const bookPages = useMemo(() => {
    if (!story) {
      return []
    }

    const totalChapters = story.output.chapters.length
    const prompt = getStoryCoverImagePrompt({
      story,
      gaiStory: story.output,
      seedImage: story.output.seedImageUrl,
    })

    if (totalChapters > 0) {
      return [
        <div
          key={0}
          className="flex flex-col gap-2 bg-white p-4 max-w-screen-md"
        >
          <span className="font-bold text-4xl text-primary">Cover image</span>
          <CoverImageEditor
            story={story}
            prompt={prompt}
            regenerateImage={regenerateCoverImage}
          />
        </div>,
        ...storyPages,
        <div key={totalChapters + 1}>
          <StoryLastPage story={story} />
        </div>,
      ]
    }

    return []
  }, [story, storyPages, regenerateCoverImage])

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
                    1. Edit image
                  </span>
                  <ImageEditorControl
                    story={story}
                    onRegenerate={regenerateAllImages}
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
