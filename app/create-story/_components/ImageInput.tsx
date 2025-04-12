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
    <div>
      <label
        htmlFor="story-image-input"
        className="font-bold text-4xl text-primary"
      >
        Your image (optional)
      </label>
      <div className="flex flex-col justify-between items-center mt-3 gap-3">
        <Input
          id="story-image-input"
          type="file"
          accept="image/*"
          size="md"
          className="max-w-md"
          onChange={onFilePick}
        />
        <Button color="primary" onPress={onTakePhotoOpen} className="w-full">
          Take Photo
        </Button>
        {image && (
          <div className="relative flex justify-center items-center gap-2 max-h-[180px]">
            <Image src={image} className="max-h-[180px]" alt="" />
            <Button
              color="danger"
              onPress={onFileRemove}
              className="absolute top-0 right-0 z-10"
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
