import useRegenerateImage from "@/app/_components/story/useRegenerateImage"
import { Chapter } from "@/config/schema"
import { Button } from "@nextui-org/button"
import { Image } from "@nextui-org/react"

interface StoryImageProps {
  chapter: Chapter
  regenerateImage?: (chapter: Chapter) => Promise<void>
}

export default function StoryImage({
  chapter,
  regenerateImage,
}: StoryImageProps) {
  const { onRegenerateImage, isLoading } = useRegenerateImage({
    regenerateImage: regenerateImage
      ? () => regenerateImage(chapter)
      : undefined,
  })

  return (
    <div className="w-full flex flex-col items-center gap-responsive-sm">
      <div className="w-full aspect-square relative">
        <Image
          src={chapter.chapter_image}
          alt={chapter.image_prompt}
          className="w-full h-full object-contain"
          radius="lg"
        />
      </div>
      {onRegenerateImage && (
        <Button
          color="primary"
          className="w-full py-6 text-responsive-base"
          onPress={onRegenerateImage}
          isLoading={isLoading}
        >
          Regenerate chapter image
        </Button>
      )}
    </div>
  )
}
