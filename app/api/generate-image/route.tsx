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

async function getSeedImageUrl(seedImage: string | null) {
  if (!seedImage) return null;

  try {
    let seedImageUrl: string | null = null;

    // Handle URL
    if (seedImage.startsWith("https://")) {
      seedImageUrl = seedImage;
    }
    // Handle base64 data
    else if (seedImage.startsWith("data:")) {
      let filetype = "png"; // Default to png
      const base64Header = seedImage.split(";base64,")[0];
      
      if (base64Header.includes("/")) {
        filetype = base64Header.split("/")[1];
      }
      
      const filename = `/ai-story/temp/${Date.now()}.${filetype}`;
      seedImageUrl = await uploadData(filename, seedImage);
    }
    // Handle raw base64 string (from camera)
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

  let generatedImageUrl: string;
  try {
    const output = await replicate.run(model, { input }) as string[];
    if (!output || !output.length) {
      throw new Error("No image generated");
    }
    generatedImageUrl = output[0];
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }

  const base64 =
    "data:image/png;base64," + (await convertToBase64(generatedImageUrl))
  const imageUrl = await uploadData("/ai-story/" + Date.now() + ".png", base64)

  return NextResponse.json({ imageUrl, seedImageUrl })
}
