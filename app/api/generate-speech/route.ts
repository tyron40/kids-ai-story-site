import { storage } from "../../../config/firebaseConfig"
import axios from "axios"
import crypto from "crypto"
import { getDownloadURL, ref, uploadBytes, type FirebaseStorage } from "firebase/storage"
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

if (!storage) {
  throw new Error('Firebase storage is not initialized')
}

const firebaseStorage: FirebaseStorage = storage

function generateTextHash(text: string): string {
  return crypto.createHash("md5").update(text).digest("hex").substring(0, 8)
}

async function readWavFile(url: string) {
  const response = await axios.get(url, { responseType: "arraybuffer" })
  return response.data
}

export async function POST(req: NextRequest) {
  const { storyId, chapter, text } = await req.json()

  const textHash = generateTextHash(text)
  const filename = `s${storyId}_c${chapter}_${textHash}.wav`

  const audioRef = ref(firebaseStorage, filename)

  let url: string | null = null

  try {
    url = await getDownloadURL(audioRef)
  } catch (error) {
    console.error('Error getting download URL:', error)
  }

  if (url) {
    return NextResponse.json({ audioUrl: url })
  }

  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    })

    const input = {
      text,
    }

    const output = (await replicate.run(
      "jaaari/kokoro-82m:dfdf537ba482b029e0a761699e6f55e9162cfd159270bfe0e44857caa5f275a6",
      { input }
    )) as unknown as string

    const data = await readWavFile(output)

    await uploadBytes(audioRef, new Uint8Array(data), {
      contentType: "audio/wav",
    })

    url = await getDownloadURL(audioRef)

    return NextResponse.json({ audioUrl: url })
  } catch (error) {
    console.error('Error generating speech:', error)
    return NextResponse.json(
      { error: 'Failed to generate speech', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
