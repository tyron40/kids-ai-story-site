import StoryCoverPage from "@/app/_components/story/StoryCoverPage"
import ImageEditorControl from "./ImageEditorControl"
import SkinColor from "@/app/_components/story/controls/SkinColor"
import { useCallback, useState } from "react"
import { FieldData } from "@/app/_components/story/controls/types"
import { StoryItem } from "@/app/_utils/db"
import { Button } from "@nextui-org/button"
import { Textarea } from "@nextui-org/input"
import { RegenerateImageParams } from "./types"

interface CoverImageEditorProps {
  story: StoryItem
  prompt: string
  regenerateImage: (params: RegenerateImageParams) => Promise<void>
}

export default function CoverImageEditor({
  story,
  prompt,
  regenerateImage,
}: CoverImageEditorProps) {
  const [image, setImage] = useState<string | File | undefined>()
  const [imagePrompt, setImagePrompt] = useState<string>(prompt)
  const [skinColor, setSkinColor] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  const onSkinColorChange = useCallback((field: FieldData) => {
    setSkinColor(field.fieldValue as string)
  }, [])

  const onRegenerateImage = async () => {
    try {
      setIsLoading(true)

      if (!image || typeof image === "string") {
        await regenerateImage({
          seedImage: image,
          skinColor,
          imagePrompt,
        })
      } else {
        const imageUri = URL.createObjectURL(image)
        await regenerateImage({
          seedImage: imageUri,
          skinColor,
          imagePrompt,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-responsive-md items-center lg:items-start">
      <div className="w-full lg:w-[300px]">
        <StoryCoverPage
          imageUrl={story?.coverImage}
          className="w-full aspect-square rounded-lg overflow-hidden"
        />
      </div>
      <div className="flex flex-col gap-responsive-md w-full">
        <span className="font-bold text-responsive-xl text-primary">1. Edit image</span>
        <ImageEditorControl
          story={story}
          onRegenerate={async (newImage?: File | string) => setImage(newImage)}
        />
        <SkinColor value={story.skinColor} userSelection={onSkinColorChange} />
        <label
          htmlFor="cover-image-prompt"
          className="font-bold text-responsive-xl text-primary"
        >
          3. Image prompt
        </label>
        <Textarea
          id="cover-image-prompt"
          defaultValue={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          color="primary"
          onPress={onRegenerateImage}
          isLoading={isLoading}
          className="w-full py-6 text-responsive-base"
        >
          Generate new image
        </Button>
      </div>
    </div>
  )
}
