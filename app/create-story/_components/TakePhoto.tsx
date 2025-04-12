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

interface ITakePhoto {
  isOpen: boolean
  onClose: () => void
  onOpenChange: () => void
  onPhotoPick: (image: string) => void
}

export default function TakePhoto({
  isOpen,
  onClose,
  onOpenChange,
  onPhotoPick,
}: ITakePhoto) {
  const camera = useRef<CameraType>(null)
  const [photo, setPhoto] = useState<string | null>(null)

  const onTakePhoto = () => {
    if (!camera.current) {
      return
    }

    const photo = camera.current.takePhoto("base64url")
    setPhoto(photo as string)
  }

  const onRetakePhoto = () => {
    setPhoto(null)
  }

  const onPickPhoto = () => {
    onPhotoPick(photo!)
    onClose()
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
                    " You need to give permission to access the camera.",
                  switchCamera: "Not possible to switch camera.",
                  canvas: "Canvas not supported.",
                }}
                facingMode="environment"
              />
            ) : (
              <Image src={photo} width="100%" alt="" />
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
            <Button color="primary" onPress={onRetakePhoto}>
              Retake photo
            </Button>
          )}
          {photo && (
            <Button color="primary" onPress={onPickPhoto}>
              Pick photo
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
