import { UserSelectionHandler } from "@/app/_components/story/controls/types"
import { Input } from "@nextui-org/input"
import { Button, Image, useDisclosure } from "@nextui-org/react"
import { ChangeEventHandler, useState } from "react"

import TakePhoto from "./TakePhoto"

export default function ImageInput({
  userSelection,
}: {
  userSelection: UserSelectionHandler
}) {
  const [image, setImage] = useState<string | null>(null)
  const {
    isOpen: isTakePhotoOpen,
    onOpen: onTakePhotoOpen,
    onClose: onTakePhotoClose,
    onOpenChange: onTakePhotoOpenChange,
  } = useDisclosure()

  const onFilePick: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      setImage(URL.createObjectURL(file))
      userSelection({
        fieldName: "seedImage",
        fieldValue: file,
      })
    }
  }

  const onPhotoPick = (image: string) => {
    setImage(image)
    userSelection({
      fieldName: "seedImage",
      fieldValue: image,
    })
  }

  const onFileRemove = () => {
    setImage(null)
    userSelection({
      fieldName: "seedImage",
      fieldValue: null,
    })
  }

  return (
    <div className="w-full">
      <label
        htmlFor="story-image-input"
        className="font-bold text-responsive-xl text-primary block mb-responsive-sm"
      >
        Your image (optional)
      </label>
      <div className="flex flex-col justify-between items-stretch mt-responsive-sm gap-responsive-sm">
        <div className="relative w-full">
          <Input
            id="story-image-input"
            type="file"
            accept="image/*"
            size="lg"
            className="w-full"
            onChange={onFilePick}
          />
        </div>
        <Button 
          color="primary" 
          onPress={onTakePhotoOpen} 
          className="w-full py-6 text-responsive-base"
        >
          Take Photo
        </Button>
        {image && (
          <div className="relative w-full aspect-video flex justify-center items-center">
            <Image 
              src={image} 
              className="w-full h-full object-contain rounded-lg" 
              alt="Selected image preview" 
            />
            <Button
              color="danger"
              onPress={onFileRemove}
              className="absolute top-2 right-2 z-10"
              size="sm"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
      <TakePhoto
        isOpen={isTakePhotoOpen}
        onClose={onTakePhotoClose}
        onOpenChange={onTakePhotoOpenChange}
        onPhotoPick={onPhotoPick}
      />
    </div>
  )
}
