"use client"

import { Button, Card, CardFooter } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { StoryItem, deleteStory } from "@/app/_utils/db"
import { useState } from "react"
import { toast } from "react-toastify"
import { IoTrashOutline } from "react-icons/io5"

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
    <div className="relative">
      {/* Delete Button - Positioned absolutely in the top-right corner */}
      <Button
        isIconOnly
        className="absolute -top-2 -right-2 z-20 bg-red-500 text-white rounded-full w-8 h-8 shadow-lg hover:bg-red-600"
        size="sm"
        isLoading={isDeleting}
        onClick={handleDelete}
      >
        {!isDeleting && <IoTrashOutline className="text-lg" />}
      </Button>

      <Link href={"/view-story/" + story?.storyId}>
        <Card
          isFooterBlurred
          className="w-full h-[300px] col-span-12 sm:col-span-5 hover:scale-105 transition-all cursor-pointer"
        >
          <Image
            alt="Card example background"
            className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
            src={story?.coverImage}
            width={500}
            height={500}
          />
          <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
            <div>
              <p className="text-black text-xl">{story.output.story_cover.title}</p>
            </div>
            <Button 
              className="text-tiny" 
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
