import { UserSelectionHandler } from "@/app/_components/story/controls/types"
import { Input } from "@nextui-org/input"
import { Button, Image, useDisclosure } from "@nextui-org/react"
import { ChangeEventHandler, useRef, useState } from "react"
import { analyzeFace } from "@/app/_utils/faceapi"
import TakePhoto from "./TakePhoto"

export default function ImageInput({
  userSelection,
}: {
  userSelection: UserSelectionHandler
}) {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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

  const processImage = async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB")
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error("Please select a valid image file")
      }

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
        // Continue even if face analysis fails
      }

      userSelection({
        fieldName: "seedImage",
        fieldValue: file,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image")
      setImage(null)
      setFaceDetails(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    } finally {
      setLoading(false)
    }
  }

  const onFilePick: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processImage(file)
  }

  const onPhotoPick = async (image: string, file?: File) => {
    setImage(image)

    if (file) {
      await processImage(file)
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
    setError(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    userSelection({
      fieldName: "seedImage",
      fieldValue: null,
    })
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <label
        htmlFor="story-image-input"
        className="font-bold text-4xl text-primary block mb-4"
      >
        Your image (optional)
      </label>
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Input
            ref={inputRef}
            id="story-image-input"
            type="file"
            accept="image/*"
            size="lg"
            className="w-full"
            onChange={onFilePick}
            isDisabled={loading}
            description="Max file size: 5MB"
          />
          {loading && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="loading-spinner" />
            </div>
          )}
        </div>

        <Button 
          color="primary" 
          onPress={onTakePhotoOpen} 
          className="w-full"
          isDisabled={loading}
        >
          Take Photo
        </Button>

        {error && (
          <div className="text-danger text-sm p-2 bg-danger-50 rounded-lg">
            {error}
          </div>
        )}

        {image && (
          <div className="relative flex flex-col items-center gap-2">
            <div className="relative w-full max-h-[200px] overflow-hidden rounded-lg">
              <Image 
                src={image} 
                alt="Preview" 
                className="w-full h-full object-contain"
                style={{ maxHeight: '200px' }}
              />
              <Button
                color="danger"
                onPress={onFileRemove}
                className="absolute top-2 right-2 min-w-0 w-8 h-8 p-0"
                isIconOnly
              >
                ✕
              </Button>
            </div>
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

      <style jsx>{`
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
