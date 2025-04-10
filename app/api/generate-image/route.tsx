import { storage } from "@/config/firebaseConfig"
import axios from "axios"
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

const jobQueue: { id: string; prompt: string; seedImage: string; skinColor: string; status: string; result?: string }[] = []

async function convertToBase64(imageUrl: string) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" })
  return Buffer.from(response.data).toString("base64")
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

async function processJob(job: { id: string; prompt: string; seedImage: string; skinColor: string }) {
  const { prompt, seedImage, skinColor, id } = job
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

  // Update job status
  const jobIndex = jobQueue.findIndex(j => j.id === id)
  if (jobIndex !== -1) {
    jobQueue[jobIndex].status = "completed"
    jobQueue[jobIndex].result = imageUrl
  }
}

export async function POST(req: NextRequest) {
  const { prompt, seedImage, skinColor } = await req.json()
  const jobId = Date.now().toString() // Simple job ID based on timestamp

  // Add job to queue
  jobQueue.push({ id: jobId, prompt, seedImage, skinColor, status: "pending" })

  // Process the job in the background
  processJob({ id: jobId, prompt, seedImage, skinColor })

  return NextResponse.json({ jobId, status: "pending" })
}

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId')
  if (!jobId) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
  }
  
  const job = jobQueue.find(j => j.id === jobId)

  if (job) {
    return NextResponse.json({ status: job.status, result: job.result || null })
  } else {
    return NextResponse.json({ status: "not found" }, { status: 404 })
  }
}
