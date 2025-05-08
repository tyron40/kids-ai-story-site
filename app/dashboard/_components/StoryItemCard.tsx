"use client"

import { Button, Card, CardFooter } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { StoryItem, deleteStory } from "@/app/_utils/db"
import { useState } from "react"
import { toast } from "react-toastify"
import { IoTrashOutline } from "react-icons/io5"
import { twMerge } from "tailwind-merge"
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
    <div className="relative w-full safe-area-padding">
      <Button
        isIconOnly
        className={twMerge(
          "absolute -top-2 -right-2 z-20 bg-red-500 text-white rounded-full shadow-lg",
          "w-12 h-12 min-w-[48px] min-h-[48px]", // Increased touch target
          "touch-friendly ios-button no-tap-highlight touch-feedback",
          "hover:bg-red-600 active:bg-red-700"
        )}
        size="lg"
        isLoading={isDeleting}
        onClick={handleDelete}
      >
        {!isDeleting && <IoTrashOutline className="text-2xl" />}
      </Button>

      <Link 
        href={"/view-story/" + story?.storyId} 
        className="block w-full no-tap-highlight touch-friendly"
      >
        <Card
          isFooterBlurred
          className={twMerge(
            "w-full h-[280px] col-span-12 sm:col-span-5",
            "transition-transform duration-200 cursor-pointer",
            "touch-feedback no-select ios-text",
            "active:scale-[0.98]" // iOS touch feedback
          )}
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
            className={twMerge(
              "absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10",
              "justify-between p-4 no-select safe-area-padding"
            )}
          >
            <div className="flex-1">
              <p className="text-black text-lg font-medium line-clamp-2 ios-text">
                {story.output.story_cover.title}
              </p>
            </div>
            <Button 
              className={twMerge(
                "text-sm ml-2",
                "min-w-[100px] min-h-[44px]", // Increased touch target
                "touch-friendly ios-button no-tap-highlight touch-feedback ios-text"
              )}
              color="primary" 
              radius="full" 
              size="lg"
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
