import { Button } from "@nextui-org/button"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal"
import { Image } from "@nextui-org/react"
import { useEffect, useRef, useState } from "react"
import { Camera, CameraType } from "react-camera-pro"
import { analyzeFace } from "@/app/_utils/faceapi"

interface ITakePhoto {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  onPhotoPick: (image: string, file?: File) => void
}

interface ErrorComponentProps {
  error: string;
}

export default function TakePhoto({
  isOpen,
  onClose,
  onOpenChange,
  onPhotoPick,
}: ITakePhoto) {
  const camera = useRef<CameraType>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCameraSupported, setIsCameraSupported] = useState(true)

  useEffect(() => {
    // Check if camera is supported
    const checkCameraSupport = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const hasCamera = devices.some(device => device.kind === 'videoinput')
        setIsCameraSupported(hasCamera)
      } catch (err) {
        console.error('Failed to check camera support:', err)
        setIsCameraSupported(false)
      }
    }
    
    if (isOpen) {
      checkCameraSupport()
    }
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPhoto(null)
      setPhotoFile(null)
      setError(null)
    }
  }, [isOpen])

  const onTakePhoto = async () => {
    try {
      if (!camera.current) {
        throw new Error("Camera not initialized")
      }

      const base64Image = camera.current.takePhoto("base64url") as string
      if (!base64Image) {
        throw new Error("Failed to capture photo")
      }

      // Convert base64 to Blob and then to File
      const res = await fetch(base64Image)
      const blob = await res.blob()
      const file = new File([blob], "captured-photo.png", { type: "image/png" })

      // Analyze the captured photo
      try {
        const result = await analyzeFace(file)
        if (result) {
          console.log("📸 Face Scan (captured):", result)
        } else {
          console.warn("No face detected in captured photo.")
        }
      } catch (err) {
        console.error("Face analysis failed:", err)
        // Continue even if face analysis fails
      }

      setPhoto(base64Image)
      setPhotoFile(file)
      setError(null)
    } catch (err) {
      console.error("Failed to take photo:", err)
      setError("Failed to capture photo. Please try again.")
    }
  }

  const onRetakePhoto = () => {
    setPhoto(null)
    setPhotoFile(null)
    setError(null)
  }

  const onPickPhoto = () => {
    if (photo) {
      onPhotoPick(photo, photoFile ?? undefined)
      onClose()
    }
  }

  const ErrorComponent = ({ error }: ErrorComponentProps) => (
    <div className="text-center p-4 text-danger">{error}</div>
  )

  if (!isCameraSupported) {
    return (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Camera Not Available</ModalHeader>
          <ModalBody>
            <p>Your device does not have a camera or camera access is not available. Please use the file upload option instead.</p>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onPress={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Take Photo</ModalHeader>
        <ModalBody className="h-96 min-h-96">
          <div className="relative flex flex-1 w-full">
            {!photo ? (
              <div className="relative w-full h-full">
                <Camera
                  ref={camera}
                  errorMessages={{
                    noCameraAccessible:
                      "No camera found. Please use the file upload option instead.",
                    permissionDenied:
                      "Camera permission denied. Please allow camera access to take photos.",
                    switchCamera: "Unable to switch camera.",
                    canvas: "Your browser doesn't support camera functionality.",
                  }}
                  facingMode="environment"
                />
                {error && <ErrorComponent error={error} />}
              </div>
            ) : (
              <Image src={photo} width="100%" alt="Preview" />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onClose}>
            Cancel
          </Button>
          {!photo && (
            <Button color="primary" onPress={onTakePhoto}>
              Take photo
            </Button>
          )}
          {photo && (
            <>
              <Button color="primary" onPress={onRetakePhoto}>
                Retake photo
              </Button>
              <Button color="primary" onPress={onPickPhoto}>
                Pick photo
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
