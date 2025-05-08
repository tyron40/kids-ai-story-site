"use client"

import CustomLoader from "@/app/_components/CustomLoader"
import { getUserStories, StoryItem } from "@/app/_utils/db"
import { useUser } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"
import StoryItemCard from "./StoryItemCard"
import LinkButton from "@/app/_components/LinkButton"
import { twMerge } from "tailwind-merge"
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
    <div className={twMerge(
      "w-full safe-area-padding",
      "px-4 sm:px-6 md:px-8 max-w-7xl mx-auto"
    )}>
      <div className={twMerge(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        "gap-6 sm:gap-8 mt-6 sm:mt-8",
        "ios-scroll touch-spacing"
      )}>
        {storyList.length > 0 &&
          storyList.map((item: StoryItem) => (
            <div 
              key={item.id} 
              className={twMerge(
                "flex flex-col items-center",
                "gap-6 w-full",
                "no-select touch-friendly"
              )}
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
                className={twMerge(
                  "w-full sm:w-auto",
                  "min-h-[48px]", // Increased touch target
                  "text-base ios-text"
                )}
              />
            </div>
          ))}
      </div>
      <CustomLoader isLoading={loading} />
      {storyList.length === 0 && !loading && (
        <div className={twMerge(
          "text-center mt-8 sm:mt-10 px-4",
          "safe-area-padding ios-text"
        )}>
          <p className="text-gray-500 text-lg sm:text-xl font-medium">
            No stories found. Create your first story!
          </p>
        </div>
      )}
    </div>
  )
}
