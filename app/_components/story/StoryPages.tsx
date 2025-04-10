import { generateSpeech } from "@/app/_utils/api"
import { Chapter } from "@/config/schema"
import { Button } from "@nextui-org/button"
import { Textarea } from "@nextui-org/input"
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react"
import { AiOutlineLoading } from "react-icons/ai"
import { MdPlayCircleFilled } from "react-icons/md"
import { toast } from "react-toastify"

interface StoryPagesProps {
  storyId: number
  chapter: Chapter
  chapterNumber: number
  isEditable?: boolean
  regenerateImage?: ((chapter: Chapter) => Promise<void>) | null
  regenerateText?: ((chapter: Chapter) => Promise<void>) | null
  saveTextChanges?: ((chapter: Chapter, text: string) => Promise<void>) | null
}

const StoryPages = forwardRef(
  (
    {
      storyId,
      chapter,
      chapterNumber,
      isEditable = false,
      regenerateImage,
      regenerateText,
      saveTextChanges,
    }: StoryPagesProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const notify = (msg: string) => toast(msg)
    const notifyError = (msg: string) => toast.error(msg)

    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [isAudioLoading, setIsAudioLoading] = useState(false)
    const audioRef = useRef<HTMLAudioElement>(null)

    const [isRegeneratingImage, setIsRegeneratingImage] = useState(false)
    const [isRegeneratingText, setIsRegeneratingText] = useState(false)

    const [chapterText, setChapterText] = useState(chapter.chapter_text)
    const [isSavingTextChanges, setIsSavingTextChanges] = useState(false)

    useEffect(() => {
      setChapterText(chapter.chapter_text)
    }, [chapter.chapter_text])

    const playSpeech = async () => {
      if (isAudioLoading) {
        return
      }

      if (audioUrl) {
        audioRef.current?.play()
        return
      }

      try {
        setIsAudioLoading(true)

        const audioUrl = await generateSpeech(
          storyId,
          chapterNumber,
          chapter.chapter_text
        )

        setAudioUrl(audioUrl)
      } finally {
        setIsAudioLoading(false)
      }
    }

    const onRegenerateImage = async () => {
      if (isRegeneratingImage || !regenerateImage) {
        return
      }

      try {
        setIsRegeneratingImage(true)
        await regenerateImage(chapter)
        notify("Chapter image updated")
      } catch (e) {
        console.error(e)
        notifyError("Something went wrong, please try again.")
      } finally {
        setIsRegeneratingImage(false)
      }
    }

    const onRegenerateText = async () => {
      if (isRegeneratingText || !regenerateText) {
        return
      }

      try {
        setIsRegeneratingText(true)
        await regenerateText(chapter)
        setAudioUrl(null)
      } finally {
        setIsRegeneratingText(false)
      }
    }

    const onSaveTextChanges = async () => {
      if (isSavingTextChanges || !saveTextChanges) {
        return
      }

      try {
        setIsSavingTextChanges(true)
        await saveTextChanges(chapter, chapterText)
        setAudioUrl(null)
      } finally {
        setIsSavingTextChanges(false)
      }
    }

    const isLoading =
      isRegeneratingImage || isRegeneratingText || isSavingTextChanges

    return (
      <div ref={ref} className="flex flex-col gap-4">
        <h2 className="text-2xl fontbold text-primary flex justify-between">
          {chapter.chapter_title}
          <button className="text-3xl cursor-pointer" onClick={playSpeech}>
            {isAudioLoading ? (
              <AiOutlineLoading className="animate-spin" />
            ) : (
              <MdPlayCircleFilled />
            )}
          </button>
        </h2>
        {audioUrl && (
          <audio controls autoPlay ref={audioRef} src={audioUrl}>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        )}
        {isEditable ? (
          <Textarea
            label="Edit chapter text"
            value={chapterText}
            classNames={{ label: "text-md", input: "text-lg" }}
            onChange={(e) => setChapterText(e.target.value)}
          />
        ) : (
          <p className="text-lg p-6 rounded-lg bg-slate-100">
            {chapter.chapter_text}
          </p>
        )}
        <div className="flex gap-4">
          {regenerateImage && (
            <Button
              color="primary"
              onPress={onRegenerateImage}
              isLoading={isRegeneratingImage}
              isDisabled={isLoading}
            >
              Regenerate image
            </Button>
          )}
          {regenerateText && (
            <Button
              color="primary"
              onPress={onRegenerateText}
              isLoading={isRegeneratingText}
              isDisabled={isLoading}
            >
              Regenerate text
            </Button>
          )}
          {isEditable && (
            <Button
              color="primary"
              onPress={onSaveTextChanges}
              isLoading={isSavingTextChanges}
              isDisabled={isLoading}
            >
              Save text changes
            </Button>
          )}
        </div>
      </div>
    )
  }
)

StoryPages.displayName = "StoryPages"

export default StoryPages
