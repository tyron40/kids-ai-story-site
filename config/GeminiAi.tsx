/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? ""
const genAI = new GoogleGenerativeAI(apiKey)

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
})

const generationConfig = {
  temperature: 1,
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
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [
    {
      role: "user",
      parts: [
        {
          text: "create kids story on description for 5-8 Years kids, Educational story, and all images in Paper cut style: story of boy and girls and Love , give me 5 chapter, With detailed image text prompt for each of chapter and image prompt for story cover book with story name , all in JSON field format",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "story_cover": {\n    "image_prompt": "Paper cut illustration of a boy and a girl holding hands, smiling, surrounded by colorful flowers and hearts. The title of the story, \'The Boy, The Girl, and the Love,\' is written in a playful font above them.",\n    "title": "The Boy, The Girl, and the Love"\n  },\n  "chapters": [\n    {\n      "chapter_title": "A Sunny Day",\n      "chapter_text": "Once upon a time, in a town full of sunshine and laughter, lived a boy named Leo. Leo had a heart as bright as the sun and loved to play with his friends. One day, while building a sandcastle by the river, he saw a girl with eyes as blue as the sky. Her name was Lily, and she was as kind as a gentle breeze.",\n      "image_prompt": "Paper cut illustration of Leo and Lily building a sandcastle on a sunny beach. Leo is wearing a blue shirt and red shorts, while Lily is wearing a yellow dress. The sandcastle is surrounded by colorful seashells and small paper cut flowers."\n    },\n    {\n      "chapter_title": "A Shared Smile",\n      "chapter_text": "Leo was a bit shy, but Lily\'s smile was so warm that it melted away his shyness. They started talking, sharing their favorite stories and laughing at each other\'s silly jokes. Leo felt a flutter in his chest whenever Lily smiled, and he knew he was starting to like her very much.",\n      "image_prompt": "Paper cut illustration of Leo and Lily sitting on a bench, laughing and sharing a basket of apples. Leo is blushing and looking at Lily, who is holding a red apple and smiling warmly at him."\n    },\n    {\n      "chapter_title": "A Special Gift",\n      "chapter_text": "One day, Leo decided to show Lily how much she meant to him. He picked the prettiest flower from his garden, a sunflower with a golden heart, and carefully placed it in a small, paper-wrapped box. He gave it to Lily with a nervous smile, hoping she would like it.",\n      "image_prompt": "Paper cut illustration of Leo presenting a sunflower in a paper box to Lily. Lily is surprised and touched, and her eyes sparkle with joy. The background is a meadow with colorful flowers and a bright sun."\n    },\n    {\n      "chapter_title": "A Growing Feeling",\n      "chapter_text": "Lily was thrilled with the sunflower. She knew Leo liked her too, and a special feeling grew between them. They spent more and more time together, playing, sharing secrets, and discovering new adventures. They were best friends, and their friendship was full of love and kindness.",\n      "image_prompt": "Paper cut illustration of Leo and Lily holding hands, walking through a field of flowers. They are smiling happily, and the sun is setting in the background. The flowers around them are in various shades of pink, blue, and yellow."\n    },\n    {\n      "chapter_title": "A Love That Grows",\n      "chapter_text": "As time passed, Leo and Lily\'s love for each other grew stronger. They learned to understand each other',
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
  )}. The new text should not be longer the original. Result should be an object {title, text}.`

export const chapterSession = model.startChat({
  generationConfig,
})
