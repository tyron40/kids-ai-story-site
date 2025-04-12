import SkinColor from "@/app/_components/story/controls/SkinColor"
import { GAIChapter } from "@/config/GeminiAi"
import ImageEditorControl from "./ImageEditorControl"
import StoryImage from "./StoryImage"
import { StoryItem } from "@/app/_utils/db"
import { useCallback, useState } from "react"
import { FieldData } from "@/app/_components/story/controls/types"
import { Textarea } from "@nextui-org/input"
import { Button } from "@nextui-org/button"
import { RegenerateChapterImageParams } from "./types"

interface ChapterEditorProps {
  story: StoryItem
  chapter: GAIChapter
  regenerateImage: (params: RegenerateChapterImageParams) => Promise<void>
}

export default function ChapterEditor({
  story,
  chapter,
  regenerateImage,
}: ChapterEditorProps) {
  const [image, setImage] = useState<string | File | undefined>()
  const [imagePrompt, setImagePrompt] = useState<string>(chapter.image_prompt)
  const [skinColor, setSkinColor] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const onSkinColorChange = useCallback((field: FieldData) => {
    setSkinColor(field.fieldValue as string)
  }, [])

  const onRegenerateImage = async () => {
    try {
      setIsLoading(true)

      if (!image || typeof image === "string") {
        await regenerateImage({
          chapter,
          seedImage: image,
          skinColor,
          imagePrompt,
        })
      } else {
        const imageUri = URL.createObjectURL(image)
        await regenerateImage({
          chapter,
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
    <div className="flex flex-col lg:flex-row gap-2 items-center lg:items-start">
      <StoryImage chapter={chapter} width={300} height={300} />
      <div className="flex flex-col gap-4">
        <span className="font-bold text-4xl text-primary">1. Edit image</span>
        <ImageEditorControl
          story={story}
          onRegenerate={async (newImage?: File | string) => setImage(newImage)}
        />
        <SkinColor
          value={chapter.skin_color ?? story.skinColor}
          userSelection={onSkinColorChange}
        />
        <label
          htmlFor={`image-prompt-${chapter.chapter_title}`}
          className="font-bold text-4xl text-primary"
        >
          3. Image prompt
        </label>
        <Textarea
          id={`image-prompt-${chapter.chapter_title}`}
          defaultValue={imagePrompt}
          onChange={(e) => setImagePrompt(e.target.value)}
        />
        <Button
          color="primary"
          onPress={onRegenerateImage}
          isLoading={isLoading}
        >
          Generate new image
        </Button>
      </div>
    </div>
  )
}
