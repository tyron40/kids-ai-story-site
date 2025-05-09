import { storage, type FirebaseStorage } from "../../../config/firebaseConfig"
import axios from "axios"
import { getDownloadURL, ref, uploadString } from "firebase/storage"
import { NextRequest, NextResponse } from "next/server"
import Replicate from "replicate"

if (!storage) {
  throw new Error('Firebase storage is not initialized')
}

const firebaseStorage: FirebaseStorage = storage

async function convertToBase64(imageUrl: string) {
  try {
    const response = await axios.get(imageUrl, { 
      responseType: "arraybuffer",
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024
    })
    return Buffer.from(response.data).toString("base64")
  } catch (error) {
    console.error("Error converting image to base64:", error)
    throw new Error("Failed to process image")
  }
}

async function uploadData(filename: string, data: string): Promise<string> {
  const fileRef = ref(firebaseStorage, filename)
  await uploadString(fileRef, data, "data_url")
  return await getDownloadURL(fileRef)
}

async function getSeedImageUrl(seedImage: string | null): Promise<string | null> {
  if (!seedImage) return null;

  try {
    let seedImageUrl: string | null = null;

    if (seedImage.startsWith("https://")) {
      seedImageUrl = seedImage;
    }
    else if (seedImage.startsWith("data:")) {
      const base64Header = seedImage.split(";base64,")[0];
      const filetype = base64Header.includes("/") ? base64Header.split("/")[1] : "png";
      const filename = `/ai-story/temp/${Date.now()}.${filetype}`;
      seedImageUrl = await uploadData(filename, seedImage);
    }
    else if (seedImage.match(/^[A-Za-z0-9+/=]+$/)) {
      const base64Data = `data:image/png;base64,${seedImage}`;
      const filename = `/ai-story/temp/${Date.now()}.png`;
      seedImageUrl = await uploadData(filename, base64Data);
    }

    return seedImageUrl;
  } catch (error) {
    console.error("Error processing seed image:", error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, seedImage, skinColor } = await req.json()

    req.signal.addEventListener('abort', () => {
      throw new Error('Request timeout')
    })

    const seedImageUrl = await getSeedImageUrl(seedImage)

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_KEY,
    })

    const skinColorPrompt = skinColor ? `person with ${skinColor} skin tone` : ""
    const basePrompt = `${prompt} ${skinColorPrompt}`.trim()
    
    const imagePrompt = seedImage 
      ? `Create a highly detailed image that looks exactly like the reference image but ${basePrompt}. Maintain the same facial features, expressions, and details as the input image.`
      : `Create a highly detailed, professional quality image of ${basePrompt}. The image should be sharp, well-composed, and realistic.`

    const input = seedImage
      ? {
          prompt: imagePrompt,
          num_inference_steps: 75,
          guidance_scale: 7.5,
          negative_prompt: "blurry, low quality, distorted features, unrealistic",
          input_image: seedImageUrl,
          style_name: "(No style)",
        }
      : {
          prompt: imagePrompt,
          negative_prompt: "blurry, low quality, distorted, unrealistic",
          num_inference_steps: 75,
          guidance_scale: 7.5,
          output_format: "png",
          output_quality: 100,
          aspect_ratio: "1:1",
        }

    const model = seedImage
      ? "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4"
      : "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"

    const output = await Promise.race([
      replicate.run(model, { input }) as Promise<string[]>,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Image generation timeout')), 120000)
      )
    ]) as string[];

    if (!output || !output.length) {
      throw new Error("No image generated");
    }

    const generatedImageUrl = output[0];
    const base64 = "data:image/png;base64," + (await convertToBase64(generatedImageUrl))
    const imageUrl = await uploadData("/ai-story/" + Date.now() + ".png", base64)

    if (seedImage) {
      const seedImagePath = `/ai-story/seed/${Date.now()}.png`
      await uploadData(seedImagePath, seedImage)
    }

    return NextResponse.json({ 
      imageUrl, 
      seedImageUrl,
      success: true
    })

  } catch (error) {
    console.error("Error in image generation process:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const isTimeout = error instanceof Error && 
      (error.message.includes('timeout') || error.message.includes('aborted'));
    
    return NextResponse.json(
      { 
        error: "Failed to generate image", 
        details: errorMessage,
        code: isTimeout ? 'TIMEOUT' : 'GENERATION_ERROR',
        success: false
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
