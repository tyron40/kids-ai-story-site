import { Chapter } from "@/config/schema"

export interface RegenerateImageParams {
  seedImage?: File | string
  skinColor?: string
  imagePrompt?: string
}

export interface RegenerateChapterImageParams extends RegenerateImageParams {
  chapter: Chapter
}
