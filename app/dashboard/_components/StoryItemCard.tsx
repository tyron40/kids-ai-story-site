"use client"

import { Button, Card, CardFooter } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { StoryItem, deleteStory } from "@/app/_utils/db"
import { useState } from "react"
import { toast } from "react-toastify"
import { IoTrashOutline } from "react-icons/io5"
import "@/app/styles/mobile.css"

interface StoryItemCardProps {
  story: StoryItem
  onDelete?: () => void
}

export default function StoryItemCard({ story, onDelete }: StoryItemCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (window.confirm("Are you sure you want to delete this story?")) {
      try {
        setIsDeleting(true)
        await deleteStory(story.storyId)
        toast.success("Story deleted successfully")
        onDelete?.()
      } catch (error) {
        console.error("Error deleting story:", error)
        toast.error("Failed to delete story")
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="relative w-full">
      <Button
        isIconOnly
        className="absolute -top-2 -right-2 z-20 bg-red-500 text-white rounded-full w-10 h-10 min-w-0 shadow-lg hover:bg-red-600 active:bg-red-700 touch-friendly no-tap-highlight touch-feedback"
        size="sm"
        isLoading={isDeleting}
        onClick={handleDelete}
      >
        {!isDeleting && <IoTrashOutline className="text-xl" />}
      </Button>

      <Link href={"/view-story/" + story?.storyId} className="block w-full no-tap-highlight">
        <Card
          isFooterBlurred
          className="w-full h-[280px] col-span-12 sm:col-span-5 hover:scale-105 transition-all cursor-pointer no-select"
        >
          <Image
            alt="Story cover"
            className="z-0 w-full h-full object-cover"
            src={story?.coverImage}
            width={500}
            height={500}
            priority
            draggable={false}
          />
          <CardFooter 
            className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between p-4 no-select"
          >
            <div className="flex-1">
              <p className="text-black text-lg font-medium line-clamp-2">{story.output.story_cover.title}</p>
            </div>
            <Button 
              className="text-sm ml-2 min-w-[90px] touch-friendly no-tap-highlight touch-feedback" 
              color="primary" 
              radius="full" 
              size="sm"
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault()
                e.stopPropagation()
                window.location.href = `/view-story/${story.storyId}`
              }}
            >
              Read Now
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </div>
  )
}
