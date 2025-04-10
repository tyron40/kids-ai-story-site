"use client"
import CustomLoader from "@/app/_components/CustomLoader"
import { getUserStories, StoryItem } from "@/app/_utils/db"
import { useUser } from "@clerk/nextjs"
import { useCallback, useEffect, useState } from "react"

import StoryItemCard from "./StoryItemCard"
import LinkButton from "@/app/_components/LinkButton"

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {storyList.length > 0 &&
          storyList.map((item: StoryItem) => (
            <div key={item.id} className="flex flex-col items-center gap-4">
              <StoryItemCard story={item} />
              <LinkButton
                href={`/edit-story/${item.storyId}`}
                text="Edit Story"
              />
            </div>
          ))}
      </div>
      <CustomLoader isLoading={loading} />
    </div>
  )
}
