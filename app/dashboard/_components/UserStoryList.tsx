"use client"

import CustomLoader from "@/app/_components/CustomLoader"
import { getUserStories, StoryItem } from "@/app/_utils/db"
import { useUser } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import StoryItemCard from "./StoryItemCard"
import LinkButton from "@/app/_components/LinkButton"
import "@/app/styles/mobile.css"

export default function UserStoryList() {
  const { user } = useUser()
  const [storyList, setStoryList] = useState<StoryItem[]>([])
  const [loading, setLoading] = useState(false)

  const initData = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getUserStories(
        user?.primaryEmailAddress?.emailAddress ?? ""
      )
      setStoryList(result)
    } finally {
      setLoading(false)
    }
  }, [user?.primaryEmailAddress?.emailAddress])

  useEffect(() => {
    if (user) {
      initData()
    }
  }, [initData, user])

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full safe-area-padding">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 smooth-scroll touch-spacing">
        {storyList.length > 0 &&
          storyList.map((item: StoryItem) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center gap-4 w-full no-select"
            >
              <StoryItemCard 
                story={item} 
                onDelete={() => {
                  // Refresh the story list after deletion
                  initData()
                }}
              />
              <LinkButton
                href={`/edit-story/${item.storyId}`}
                text="Edit Story"
                className="w-full sm:w-auto touch-friendly touch-feedback"
              />
            </div>
          ))}
      </div>
      <CustomLoader isLoading={loading} />
      {storyList.length === 0 && !loading && (
        <div className="text-center mt-8 sm:mt-10 px-4">
          <p className="text-gray-500 text-lg sm:text-xl font-medium">
            No stories found. Create your first story!
          </p>
        </div>
      )}
    </div>
  )
}
