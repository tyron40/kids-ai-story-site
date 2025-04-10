import { UserSelectionHandler } from "@/app/_components/story/controls/types"
import { Input } from "@nextui-org/input"
import { Button, Image, useDisclosure } from "@nextui-org/react"
import { ChangeEventHandler, useEffect, useRef, useState } from "react"
import { analyzeFace } from "@/app/_utils/faceapi"
import TakePhoto from "./TakePhoto"
import axios from "axios"

export default function ImageInput({
  userSelection,
}: {
  userSelection: UserSelectionHandler
}) {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
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
        }
      } catch (err) {
        console.error("Face analysis failed:", err)
        // Continue even if face analysis fails
      }

      // Convert file to base64 for API request
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const response = await axios.post('/api/generate-image', {
            prompt: "Generate an image based on the uploaded photo",
            seedImage: reader.result,
            skinColor: null,
          })

          setJobId(response.data.jobId)
          userSelection({
            fieldName: "seedImage",
            fieldValue: file,
          })
        } catch (err) {
          setError("Failed to start image generation")
          console.error("API request failed:", err)
        }
      }
      reader.readAsDataURL(file)

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
    setJobId(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    userSelection({
      fieldName: "seedImage",
      fieldValue: null,
    })
  }

  useEffect(() => {
    let mounted = true
    const pollJobStatus = async () => {
      if (!jobId) return

      try {
        const response = await axios.get(`/api/generate-image?jobId=${jobId}`)
        const { status, result } = response.data

        if (!mounted) return

        if (status === "completed" && result) {
          setImage(result)
          setJobId(null) // Reset job ID after completion
          userSelection({
            fieldName: "seedImage",
            fieldValue: result,
          })
        } else if (status === "not found") {
          setError("Image generation failed. Please try again.")
          setJobId(null)
        }
      } catch (err) {
        console.error("Error fetching job status:", err)
        if (mounted) {
          setError("Failed to check image generation status")
          setJobId(null)
        }
      }
    }

    const interval = setInterval(pollJobStatus, 3000) // Poll every 3 seconds

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [jobId, userSelection])

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
            isDisabled={loading || !!jobId}
            description="Max file size: 5MB"
          />
          {(loading || jobId) && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="loading-spinner" />
            </div>
          )}
        </div>

        <Button 
          color="primary" 
          onPress={onTakePhotoOpen} 
          className="w-full"
          isDisabled={loading || !!jobId}
        >
          Take Photo
        </Button>

        {error && (
          <div className="text-danger text-sm p-2 bg-danger-50 rounded-lg">
            {error}
          </div>
        )}

        {jobId && (
          <div className="text-primary text-sm p-2 bg-primary-50 rounded-lg">
            Generating image... Please wait.
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
                isDisabled={!!jobId}
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
