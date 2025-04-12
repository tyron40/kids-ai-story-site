import { storage } from "../../../../config/firebaseConfig"
import axios from "axios"
import { uploadString, ref, getDownloadURL } from "firebase/storage"
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

async function convertToBase64(imageUrl: string) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" })
  return Buffer.from(response.data).toString("base64")
}

async function uploadData(filename: string, data: string) {
  const fileRef = ref(storage, filename)
  await uploadString(fileRef, data, "data_url")
  return await getDownloadURL(fileRef)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const predictionId = searchParams.get('id')
    
    if (!predictionId) {
      return NextResponse.json(
        { error: "Prediction ID is required" },
        { status: 400 }
      )
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Get the prediction status
    const prediction = await replicate.predictions.get(predictionId)

    // If still processing, return status
    if (prediction.status !== "succeeded") {
      return NextResponse.json({
        status: prediction.status,
        id: predictionId
      })
    }

    // If completed, process and upload the image
    const generatedImageUrl = prediction.output[0] as string
    const base64 = "data:image/png;base64," + (await convertToBase64(generatedImageUrl))
    const imageUrl = await uploadData("/ai-story/" + Date.now() + ".png", base64)

    return NextResponse.json({
      status: "complete",
      imageUrl
    })
  } catch (error) {
    console.error('Error checking image generation status:', error)
    return NextResponse.json(
      { error: "Failed to check image generation status" },
      { status: 500 }
    )
  }
}
