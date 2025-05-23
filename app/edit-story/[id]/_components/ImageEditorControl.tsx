import { StoryItem } from "@/app/_utils/db"
import ImageInput from "@/app/create-story/_components/ImageInput"
import { FieldData } from "@/app/_components/story/controls/types"
import { Button } from "@nextui-org/button"
import { Image } from "@nextui-org/react"
import { useState } from "react"

interface ImageEditorControlProps {
  story: StoryItem
  onRegenerate: (image?: File | string) => Promise<void>
  generateTxt?: string
  withAction?: boolean
}

export default function ImageEditorControl({
  story,
  onRegenerate,
  generateTxt = "Generate new image",
  withAction,
}: ImageEditorControlProps) {
  const [imageInput, setImageInput] = useState<string | File | null>(null)
  const [seedData, setSeedData] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const onImageInputChange = (field: FieldData) => {
    setImageInput(field.fieldValue)
  }

  const onRegenerateImage = async () => {
    try {
      setIsLoading(true)

      if (!imageInput) {
        await onRegenerate()
        return
      }

      if (typeof imageInput === "string") {
        setSeedData(imageInput)
        await onRegenerate(imageInput)
      } else {
        const imageUri = URL.createObjectURL(imageInput)
        setSeedData(imageUri)
        await onRegenerate(imageInput)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const seedImage = seedData ?? story?.output.seedImageUrl

  return (
    <div className="flex flex-col lg:flex-row justify-center gap-responsive-md w-full">
      {seedImage && (
        <div className="flex flex-col gap-responsive-sm">
          <span className="text-responsive-base">Seed image:</span>
          <div className="w-full lg:w-[200px] aspect-square relative">
            <Image 
              src={seedImage} 
              className="w-full h-full object-contain rounded-lg" 
              alt="Seed image" 
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-responsive-md flex-1">
        <ImageInput userSelection={onImageInputChange} />
        {withAction && (
          <Button
            color="primary"
            onPress={onRegenerateImage}
            isLoading={isLoading}
            className="w-full py-6 text-responsive-base"
          >
            {generateTxt}
          </Button>
        )}
      </div>
    </div>
  )
}
