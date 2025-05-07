import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? ""
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
})

const generationConfig = {
  temperature: 0.7, // Reduced from 1 to make output more consistent
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
}

export interface GAIChapter {
  chapter_title: string
  chapter_text: string
  image_prompt: string
  chapter_image: string
  skin_color?: string | null
}

export interface GAIStoryData {
  story_cover: {
    title: string
    image_prompt: string
  }
  chapters: GAIChapter[]
  seedImageUrl: string | null
}

export function isChapter(data: object): data is GAIChapter {
  return (
    "chapter_title" in data && "chapter_text" in data && "image_prompt" in data
  )
}

export function isStoryData(data: object): data is GAIStoryData {
  if (!("story_cover" in data && "chapters" in data)) {
    return false
  }

  if (!data.story_cover || !data.chapters) {
    return false
  }

  if (typeof data.story_cover !== "object" || !Array.isArray(data.chapters)) {
    return false
  }

  if (!("title" in data.story_cover && "image_prompt" in data.story_cover)) {
    return false
  }

  return data.chapters.every((x) => isChapter(x))
}

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Create a children's story following these strict rules:
1. Main characters must remain human throughout the entire story - no transformations into animals or other beings
2. Maintain consistent character descriptions across all chapters
3. Each chapter should follow the same characters without introducing major new characters
4. Story format should be in JSON with the following structure:
{
  "story_cover": {
    "title": "Story Title",
    "image_prompt": "Detailed description for cover image"
  },
  "chapters": [
    {
      "chapter_title": "Chapter Title",
      "chapter_text": "Chapter content",
      "image_prompt": "Detailed description for chapter image"
    }
  ]
}
5. Image prompts should maintain character consistency in appearance, clothing, and features
6. No magical transformations of main characters
7. Keep the story focused on human interactions and experiences`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: 'I understand. I will create stories where characters remain consistently human throughout, maintaining their physical appearance and characteristics across all chapters. No transformations will occur.',
        },
      ],
    },
  ],
})

export const chapterNewTextPrompt = (
  index: number,
  parts: {
    title: string
    text: string
  }[]
) =>
  `Create new title and new text for index ${index} of array ${JSON.stringify(
    parts
  )}. The new text should not be longer than the original. Ensure characters remain human and consistent with their original description. Result should be an object {title, text}.`

export const chapterSession = model.startChat({
  generationConfig,
})
