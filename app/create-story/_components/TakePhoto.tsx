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
      return;
    }

    try {
      // Get base64url photo data
      const photoData = camera.current.takePhoto("base64url");
      
      if (typeof photoData === 'string') {
        // Convert base64url to base64 and add proper data URL format
        const base64Data = photoData
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        
        const formattedPhoto = `data:image/png;base64,${base64Data}`;
        setPhoto(formattedPhoto);
      } else {
        console.error('Unexpected photo data format');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }

  const onRetakePhoto = () => {
    setPhoto(null);
  }

  const onPickPhoto = () => {
    if (!photo) return;
    onPhotoPick(photo);
    onClose();
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      size="full"
      className="h-[100dvh]"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-responsive-xl">Take Photo</ModalHeader>
        <ModalBody className="h-[calc(100dvh-200px)] p-0">
          <div className="relative flex flex-1 w-full h-full">
            {!photo ? (
              <div className="w-full h-full overflow-hidden">
                <div className="relative w-full h-full">
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
                    facingMode="environment"
                  />
                </div>
              </div>
            ) : (
              <Image 
                src={photo} 
                className="w-full h-full object-contain" 
                alt="Captured photo" 
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col sm:flex-row gap-responsive-sm w-full">
          <Button 
            color="danger" 
            onPress={onClose}
            className="w-full sm:w-auto text-responsive-base py-6"
          >
            Cancel
          </Button>
          {!photo && (
            <Button 
              color="primary" 
              onPress={onTakePhoto}
              className="w-full sm:w-auto text-responsive-base py-6"
            >
              Take photo
            </Button>
          )}
          {photo && (
            <Button 
              color="primary" 
              onPress={onRetakePhoto}
              className="w-full sm:w-auto text-responsive-base py-6"
            >
              Retake photo
            </Button>
          )}
          {photo && (
            <Button 
              color="primary" 
              onPress={onPickPhoto}
              className="w-full sm:w-auto text-responsive-base py-6"
            >
              Use photo
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
