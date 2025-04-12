import { Button } from "@nextui-org/button"
import { Image } from "@nextui-org/react"
import { ForwardedRef, forwardRef } from "react"

import useRegenerateImage from "./useRegenerateImage"

interface StoryCoverPageProps {
  imageUrl: string
  className?: string
  regenerateImage?: () => Promise<void>
  width?: number
  height?: number
}

const StoryCoverPage = forwardRef(
  (
    {
      imageUrl,
      className,
      regenerateImage,
      width = 500,
      height = 500,
    }: StoryCoverPageProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { onRegenerateImage, isLoading } = useRegenerateImage({
      regenerateImage: regenerateImage,
    })

    return (
      <div ref={ref} className={className}>
        <Image
          src={imageUrl}
          alt="cover"
          width={width}
          height={height}
          className="rounded-none"
        />
        {onRegenerateImage && (
          <Button
            color="primary"
            className="mt-3"
            onPress={onRegenerateImage}
            isLoading={isLoading}
          >
            Regenerate cover image
          </Button>
        )}
      </div>
    )
  }
)

StoryCoverPage.displayName = "StoryCoverPage"

export default StoryCoverPage
