import useRegenerateImage from "@/app/_components/story/useRegenerateImage"
import { Chapter } from "@/config/schema"
import { Button } from "@nextui-org/button"
import { Image } from "@nextui-org/react"

interface StoryImageProps {
  chapter: Chapter
  regenerateImage?: (chapter: Chapter) => Promise<void>
  width?: number
  height?: number
}

export default function StoryImage({
  chapter,
  regenerateImage,
  width = 500,
  height = 500,
}: StoryImageProps) {
  const { onRegenerateImage, isLoading } = useRegenerateImage({
    regenerateImage: regenerateImage
      ? () => regenerateImage(chapter)
      : undefined,
  })

  return (
    <>
      <Image
        src={chapter.chapter_image}
        width={width}
        height={height}
        alt={chapter.image_prompt}
      />
      {onRegenerateImage && (
        <Button
          color="primary"
          className="mt-3"
          onPress={onRegenerateImage}
          isLoading={isLoading}
        >
          Regenerate chapter image
        </Button>
      )}
    </>
  )
}
