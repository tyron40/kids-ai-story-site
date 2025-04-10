import { UserSelectionHandler } from "@/app/_components/story/controls/types"
import { Input } from "@nextui-org/input"
import { Button, Image, useDisclosure } from "@nextui-org/react"
import { ChangeEventHandler, useState } from "react"
import { analyzeFace } from "@/app/_utils/faceapi"
import TakePhoto from "./TakePhoto"

export default function ImageInput({
  userSelection,
}: {
  userSelection: UserSelectionHandler
}) {
  const [image, setImage] = useState<string | null>(null)
  const [faceDetails, setFaceDetails] = useState<null | {
    age: number
    gender: string
    expressions: Record<string, number>
  }>(null)

  const {
    isOpen: isTakePhotoOpen,
    onOpen: onTakePhotoOpen,
    onClose: onTakePhotoClose,
    onOpenChange: onTakePhotoOpenChange,
  } = useDisclosure()

  const normalizeFaceResult = (
    result: Awaited<ReturnType<typeof analyzeFace>>
  ) => {
    if (!result) return null
    return {
      age: Math.round(result.age),
      gender: String(result.gender),
      expressions: { ...result.expressions },
    }
  }

  const onFilePick: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setImage(previewUrl)

    try {
      const result = await analyzeFace(file)
      const normalized = normalizeFaceResult(result)
      if (normalized) {
        setFaceDetails(normalized)
        console.log("📸 Face scan:", normalized)
      } else {
        console.warn("No face detected.")
      }
    } catch (err) {
      console.error("Face analysis failed:", err)
    }

    userSelection({
      fieldName: "seedImage",
      fieldValue: file,
    })
  }

  const onPhotoPick = async (image: string, file?: File) => {
    setImage(image)

    if (file) {
      try {
        const result = await analyzeFace(file)
        const normalized = normalizeFaceResult(result)
        if (normalized) {
          setFaceDetails(normalized)
          console.log("📸 Face scan:", normalized)
        }
      } catch (err) {
        console.error("Face analysis failed:", err)
      }

      userSelection({
        fieldName: "seedImage",
        fieldValue: file,
      })
    } else {
      userSelection({
        fieldName: "seedImage",
        fieldValue: image,
      })
    }
  }

  const onFileRemove = () => {
    setImage(null)
    setFaceDetails(null)
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
          <div className="relative flex flex-col items-center gap-2 max-h-[200px]">
            <Image src={image} className="max-h-[180px]" alt="Preview" />
            <Button
              color="danger"
              onPress={onFileRemove}
              className="absolute top-0 right-0 z-10"
            >
              Remove
            </Button>
            {faceDetails && (
              <div className="text-sm text-center text-primary mt-2">
                Detected: {faceDetails.gender}, age {faceDetails.age}
              </div>
            )}
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
