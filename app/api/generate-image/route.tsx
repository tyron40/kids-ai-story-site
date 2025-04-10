import { storage } from "@/config/firebaseConfig"
import axios from "axios"
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

async function convertToBase64(imageUrl: string) {
  const respose = await axios.get(imageUrl, { responseType: "arraybuffer" })
  return Buffer.from(respose.data).toString("base64")
}

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
  const { prompt, seedImage, skinColor } = await req.json()

  const seedImageUrl = await getSeedImageUrl(seedImage)

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  })

  const skinColorPrompt = skinColor
    ? `character with ${skinColor} skin color`
    : ""
  const imagePrompt = `${prompt} ${skinColorPrompt}`

  const input = seedImage
    ? {
        prompt: `${imagePrompt} img`,
        num_steps: 50,
        input_image: seedImageUrl,
        style_name: "(No style)",
      }
    : {
        prompt: imagePrompt,
        output_format: "png",
        output_quality: 80,
        aspect_ratio: "1:1",
      }

  const model = seedImage
    ? "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4"
    : "black-forest-labs/flux-schnell"

  const [generatedImageUrl] = (await replicate.run(model, {
    input,
  })) as string[]

  const base64 =
    "data:image/png;base64," + (await convertToBase64(generatedImageUrl))
  const imageUrl = await uploadData("/ai-story/" + Date.now() + ".png", base64)

  return NextResponse.json({ imageUrl, seedImageUrl })
}
