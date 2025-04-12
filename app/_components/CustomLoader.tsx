import { Modal, ModalContent, ModalBody } from "@nextui-org/modal"
import Image from "next/image"

export default function CustomLoader({ isLoading }: { isLoading: boolean }) {
  return (
    <Modal
      isOpen={isLoading}
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      hideCloseButton
    >
      <ModalContent>
        {() => (
          <ModalBody className="p-10 flex w-full items-center justify-center">
            <Image
              src={"/loader.gif"}
              alt="loader"
              width={300}
              height={300}
              className="w-[200px] h-[200px]"
            />
            <h2 className="font-bold text-2xl text-primary text-center">
              Please Wait...
            </h2>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
