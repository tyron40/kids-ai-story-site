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
import { getImageData } from "@/app/_utils/imageUtils"

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
  const [error, setError] = useState<string | null>(null)

  const onTakePhoto = async () => {
    if (!camera.current) {
      return;
    }

    try {
      setError(null);
      // Get base64url photo data
      const photoData = camera.current.takePhoto("base64url");
      
      if (typeof photoData === 'string') {
        // Convert base64url to base64 and add proper data URL format
        const base64Data = photoData
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        
        // Remove any existing data URL prefix before adding our own
        const cleanBase64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
        const formattedPhoto = `data:image/jpeg;base64,${cleanBase64}`;
        
        // Get optimized image data
        const optimizedPhoto = await getImageData(formattedPhoto);
        if (!optimizedPhoto) {
          throw new Error('Failed to optimize photo');
        }
        
        setPhoto(optimizedPhoto);
      } else {
        throw new Error('Unexpected photo data format');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error taking photo';
      setError(errorMessage);
      console.error('Error taking photo:', error);
    }
  }

  const onRetakePhoto = () => {
    setPhoto(null);
    setError(null);
  }

  const onPickPhoto = () => {
    if (!photo) return;
    onPhotoPick(photo);
    setError(null);
    onClose();
  }

  const handleClose = () => {
    setError(null);
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
              <div className="w-full h-full overflow-hidden bg-black">
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
                  {error && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-center p-4 text-white"
                      role="alert"
                      aria-live="polite"
                    >
                      {error}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-black flex items-center justify-center">
                <Image 
                  src={photo} 
                  className="w-full h-full object-contain" 
                  alt="Captured photo"
                  role="img"
                />
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter className="flex flex-col sm:flex-row gap-responsive-sm w-full p-responsive-md">
          <Button 
            color="danger" 
            onPress={handleClose}
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
