import { GAIStoryData } from "@/config/GeminiAi"
import { StoryItem } from "./db"

interface StoryPromptParams {
  ageGroup: string
  storyType: string
  storySubject: string
  imageStyle: string
  totalChapters: number
}

export function getStoryPrompt(params: StoryPromptParams) {
  return (process.env.NEXT_PUBLIC_CREATE_STORY_PROMPT ?? "")
    .replace("{ageGroup}", params.ageGroup)
    .replace("{storyType}", params.storyType)
    .replace("{storySubject}", params.storySubject)
    .replace("{imageStyle}", params.imageStyle)
    .replace(
      "{totalChapters}",
      params.totalChapters ? params.totalChapters.toString() : "5"
    )
}

interface StoryCoverImagePromptParams {
  story: StoryItem
  gaiStory: GAIStoryData
  seedImage: string | null
}

export function getStoryCoverImagePrompt({
  story,
  gaiStory,
  seedImage,
}: StoryCoverImagePromptParams) {
  let prompt = getBasePrompt(
    gaiStory.story_cover.title,
    gaiStory.story_cover.image_prompt
  )

  if (seedImage) {
    prompt = `${story.storySubject ?? ""}, ${story.imageStyle}`
  }

  return prompt
}

export function getBasePrompt(title: string, imagePrompt: string) {
  return `Add text with title: ${title} in bold text for book cover, ${imagePrompt}`
}
