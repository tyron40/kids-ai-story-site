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
    .replace("{ageGroup}", params.ageGroup || "kids")
    .replace("{storyType}", params.storyType || "adventure")
    .replace("{storySubject}", params.storySubject || "a brave child")
    .replace("{imageStyle}", params.imageStyle || "paper cut illustration")
    .replace("{totalChapters}", params.totalChapters.toString() || "5")
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
  // Default to base prompt with title and original image_prompt
  let prompt = getBasePrompt(
    gaiStory.story_cover.title,
    gaiStory.story_cover.image_prompt
  )

  // If user uploads/takes photo (seedImage), prioritize subject + style
  if (seedImage) {
    prompt = `${story.storySubject || "child"}, ${story.imageStyle || "paper cut illustration"}`
  }

  return prompt
}

export function getBasePrompt(title: string, imagePrompt: string) {
  return `Add bold title text: "${title}" for a children's book cover, ${imagePrompt}`
}

export function getConsistentPrompt(basePrompt: string, skinColor?: string): string {
  const skinTone = skinColor ? `${skinColor} skin, ` : ""
  const anchor =
    `same child as the cover image, ${skinTone}` +
    `same facial features, same hairstyle, same clothes, `
  return `${anchor}${basePrompt}`
}
