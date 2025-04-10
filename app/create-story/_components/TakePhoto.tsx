import { Button } from "@nextui-org/button"
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/modal"
import { Image } from "@nextui-org/react"
import { useRef, useState } from "react"
import { Camera, CameraType } from "react-camera-pro"
import { analyzeFace } from "@/app/_utils/faceapi"


interface ITakePhoto {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  onPhotoPick: (image: string, file?: File) => void
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

  const onTakePhoto = async () => {
    if (!camera.current) return

    const base64Image = camera.current.takePhoto("base64url") as string
    if (!base64Image) return

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
    }

    setPhoto(base64Image)
    setPhotoFile(file)
  }

  const onRetakePhoto = () => {
    setPhoto(null)
    setPhotoFile(null)
  }

  const onPickPhoto = () => {
    if (photo) {
      onPhotoPick(photo, photoFile ?? undefined)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="4xl">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Take Photo</ModalHeader>
        <ModalBody className="h-96 min-h-96">
          <div className="relative flex flex-1 w-full">
            {!photo ? (
              <Camera
                ref={camera}
                errorMessages={{
                  noCameraAccessible:
                    "No camera found. Please connect your camera.",
                  permissionDenied:
                    "You need to give permission to access the camera.",
                  switchCamera: "Not possible to switch camera.",
                  canvas: "Canvas not supported.",
                }}
                facingMode="user"
              />
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
