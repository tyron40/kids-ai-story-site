"use client"
import CustomLoader from "@/app/_components/CustomLoader"
import LinkButton from "@/app/_components/LinkButton"
import StoryPages from "@/app/_components/story/StoryPages"
import StoryCoverPage from "@/app/_components/story/StoryCoverPage"
import StoryLastPage from "@/app/_components/story/StoryLastPage"
import { getStory, StoryItem } from "@/app/_utils/db"
import { useUser } from "@clerk/nextjs"
import { Image } from "@nextui-org/react"
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  IoIosArrowDroprightCircle,
  IoIosArrowDropleftCircle,
} from "react-icons/io"
import HTMLFlipBook from "react-pageflip"

interface PageFlipRef {
  pageFlip: () => {
    getCurrentPageIndex: () => number
    getPageCount: () => number
    flipPrev: () => void
    flipNext: () => void
  }
}

interface PageParams {
  id: string
}

export default function ViewStory({ params }: { params: PageParams }) {
  const { user } = useUser()
  const [story, setStory] = useState<StoryItem | null>(null)
  const bookRef = useRef<PageFlipRef>(null)
  const [count, setCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  const initStory = async () => {
    try {
      setLoading(true)
      const story = await getStory(params.id)
      setStory(story)
      setTotalPages(story.output.chapters.length + 2)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initStory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const storyPages = useMemo(() => {
    if (!story) {
      return []
    }

    const totalChapters = story.output.chapters.length

    let pages: (React.JSX.Element | React.JSX.Element[])[] = []

    if (totalChapters > 0) {
      pages = [...Array(totalChapters)].map((_, index) => {
        const chapter = story.output.chapters[index]

        const image = chapter.chapter_image ? (
          <div key={`${index + 1}-img`} className="bg-white p-10 border">
            {chapter?.chapter_image && (
              <Image src={chapter?.chapter_image} alt="" />
            )}
          </div>
        ) : null

        const content = (
          <div key={index + 1} className="bg-white p-10 border">
            <StoryPages
              storyId={story.id}
              chapter={story.output.chapters[index]}
              chapterNumber={index}
            />
          </div>
        )

        return image ? [image, content] : content
      })
    }

    return pages.flat()
  }, [story])

  const bookPages = useMemo(() => {
    if (!story) {
      return []
    }

    const totalChapters = story.output.chapters.length

    if (totalChapters > 0) {
      return [
        <div key={0}>
          <StoryCoverPage imageUrl={story?.coverImage} />
        </div>,
        ...storyPages,
        <div key={totalChapters + 1}>
          <StoryLastPage story={story} />
        </div>,
      ]
    }

    return []
  }, [story, storyPages])

  const onFlip = () => {
    if (!bookRef.current) {
      return
    }

    const currentIndex = bookRef.current.pageFlip().getCurrentPageIndex()
    const totalPages = bookRef.current.pageFlip().getPageCount()

    setTotalPages(totalPages)
    setCount(currentIndex)
  }

  const title = story?.output.story_cover.title ?? ""
  const isCurrentUserStory =
    story && user?.primaryEmailAddress?.emailAddress === story?.userEmail

  return (
    <div className="flex flex-col items-center min-h-screen p-10 md:px-20 lg:px-40 gap-12">
      {!loading && (
        <h2 className="w-full bg-primary p-10 text-4xl text-white font-bold text-center">
          {title}
        </h2>
      )}
      <div className="w-full relative flex justify-center h-[500px]">
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <HTMLFlipBook
          size="stretch"
          width={500}
          minWidth={500}
          maxWidth={500}
          height={500}
          minHeight={500}
          maxHeight={500}
          showCover={true}
          useMouseEvents={false}
          ref={bookRef}
          onFlip={onFlip}
        >
          {bookPages}
        </HTMLFlipBook>
        {count !== 0 && (
          <button
            className="absolute left-0 top-[250px]"
            onClick={() => {
              bookRef.current?.pageFlip().flipPrev()
            }}
          >
            <IoIosArrowDropleftCircle className="text-[40px] text-primary cursor-pointer" />
          </button>
        )}

        {count < totalPages - 1 && (
          <button
            className="absolute right-0 top-[250px]"
            onClick={() => {
              bookRef.current?.pageFlip().flipNext()
            }}
          >
            <IoIosArrowDroprightCircle className="text-[40px] text-primary cursor-pointer" />
          </button>
        )}
      </div>
      {isCurrentUserStory && !loading && (
        <LinkButton href={`/edit-story/${story.storyId}`} text="Edit Story" />
      )}
      <CustomLoader isLoading={loading} />
    </div>
  )
}
