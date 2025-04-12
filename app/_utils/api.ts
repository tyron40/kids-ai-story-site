import axios, { AxiosResponse } from "axios"

interface GenerateImageRequest {
  prompt: string
  seedImage: string | null
  skinColor?: string | null
}

interface GenerateImageResponse {
  imageUrl: string
  seedImageUrl: string | null
}

export async function generateImage(
  params: GenerateImageRequest
): Promise<GenerateImageResponse> {
  const response = await axios.post<
    GenerateImageRequest,
    AxiosResponse<GenerateImageResponse>
  >("/api/generate-image", params)

  return response.data
}

interface GenerateSpeechRequest {
  chapter: number
  text: string
}

interface GenerateSpeechResponse {
  audioUrl: string
}

export async function generateSpeech(
  storyId: number,
  chapter: number,
  text: string
): Promise<string> {
  const response = await axios.post<
    GenerateSpeechRequest,
    AxiosResponse<GenerateSpeechResponse>
  >("/api/generate-speech", {
    storyId,
    chapter,
    text,
  })

  return response.data.audioUrl
}
