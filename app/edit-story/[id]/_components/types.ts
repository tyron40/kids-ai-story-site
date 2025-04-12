import { Chapter } from "@/config/schema"

export interface RegenerateImageParams {
  seedImage?: File | string
  skinColor?: string | null
  imagePrompt?: string
}

export interface RegenerateChapterImageParams extends RegenerateImageParams {
  chapter: Chapter
}
