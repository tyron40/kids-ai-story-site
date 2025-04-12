import { storage } from "../../../../config/firebaseConfig"
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"
import { uploadString, ref, getDownloadURL } from "firebase/storage"

async function uploadData(filename: string, data: string) {
  const fileRef = ref(storage, filename)
  await uploadString(fileRef, data, "data_url")
  return await getDownloadURL(fileRef)
}

async function getSeedImageUrl(seedImage: string) {
  let seedImageUrl: string | null = null

  const isSeedImageUrl = seedImage?.startsWith("https://")
  if (seedImage && isSeedImageUrl) {
    seedImageUrl = seedImage
  }

  const isBase64 = seedImage?.startsWith("data")
  if (seedImage && isBase64) {
    const filetype = seedImage.substring(
      "data:image/".length,
      seedImage.indexOf(";base64")
    )
    const filename = "/ai-story/temp/" + Date.now() + `.${filetype}`
    seedImageUrl = await uploadData(filename, seedImage)
  }

  return seedImageUrl
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, seedImage, skinColor } = await req.json()

    // Upload seed image first if provided
    const seedImageUrl = seedImage ? await getSeedImageUrl(seedImage) : null

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    const skinColorPrompt = skinColor ? `character with ${skinColor} skin color` : ""
    const imagePrompt = `${prompt} ${skinColorPrompt}`

    const input = seedImage
      ? {
          prompt: `${imagePrompt} img`,
          num_steps: 30, // Reduced from 50 to 30
          input_image: seedImageUrl,
          style_name: "(No style)",
        }
      : {
          prompt: imagePrompt,
          output_format: "png",
          output_quality: 70, // Reduced from 80 to 70
          aspect_ratio: "1:1",
        }

    const model = seedImage
      ? "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4"
      : "black-forest-labs/flux-schnell"

    // Start the prediction and get the ID
    const prediction = await replicate.predictions.create({
      version: model,
      input,
    })

    return NextResponse.json({ 
      status: "processing",
      id: prediction.id,
      seedImageUrl 
    })
  } catch (error) {
    console.error('Error starting image generation:', error)
    return NextResponse.json(
      { error: "Failed to start image generation" },
      { status: 500 }
    )
  }
}
