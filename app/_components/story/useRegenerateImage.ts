import { useState } from "react"
import { toast } from "react-toastify"

export default function useRegenerateImage({
  regenerateImage,
}: {
  regenerateImage?: () => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)
  const notify = (msg: string) => toast(msg)
  const notifyError = (msg: string) => toast.error(msg)

  const onRegenerateImage = async () => {
    if (isLoading) {
      return
    }

    try {
      setIsLoading(true)
      await regenerateImage!()
      notify("Image updated")
    } catch (e) {
      console.error(e)
      notifyError("Something went wrong, please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    onRegenerateImage: regenerateImage ? onRegenerateImage : null,
    isLoading,
  }
}
