import { storage } from "@/config/firebaseConfig";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req: NextRequest) {
  const { image, prompt } = await req.json();

  let imageUrl: string | null = null;

  if (image) {
    const filetype = image.substring(
      "data:image/".length,
      image.indexOf(";base64")
    );
    const filename = "/ai-story/temp/" + Date.now() + `.${filetype}`;
    const imageRef = ref(storage, filename);
    await uploadString(imageRef, image as string, "data_url");
    imageUrl = await getDownloadURL(imageRef);
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
  });

  const input = image
    ? {
        prompt: `${prompt} img`,
        num_steps: 50,
        input_image: imageUrl,
        style_name: '(No style)'
      }
    : {
        prompt: prompt,
        output_format: "png",
        output_quality: 80,
        aspect_ratio: "1:1",
      };

  const model = image
    ? "tencentarc/photomaker:ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4"
    : "black-forest-labs/flux-schnell";

  const output: any = await replicate.run(model, { input });

  return NextResponse.json({ imageUrl: output[0] });
}
