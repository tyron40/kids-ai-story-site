"use client"
import { useEffect, useState } from "react"
import StoryItemCard from "../dashboard/_components/StoryItemCard"
import { Button } from "@nextui-org/button"
import CustomLoader from "../_components/CustomLoader"
import { getStories, StoryItem } from "../_utils/db"

const TOTAL_PER_PAGE = 8

export default function ExploreMore() {
  const [offset, setOffset] = useState(0)
  const [storyList, setStoryList] = useState<StoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    let ignore = false

    getStories({ limit: TOTAL_PER_PAGE, offset })
      .then((result) => {
        if (!ignore) {
          setStoryList(result)
          setOffset(offset + TOTAL_PER_PAGE)
          setHasMore(result.length === TOTAL_PER_PAGE)
        }
      })
      .finally(() => setLoading(false))

    return () => {
      ignore = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = async () => {
    try {
      setLoading(true)

      const result = await getStories({
        limit: TOTAL_PER_PAGE,
        offset,
      })

      setStoryList((prev) => [...prev, ...result])
      setHasMore(result.length === TOTAL_PER_PAGE)
      setOffset(offset + TOTAL_PER_PAGE)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-10 md:px-20 lg:px-40">
      <h2 className="font-bold text-4xl text-primary text-center">
        Explore More Stories
      </h2>
      {storyList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-10 gap-10">
          {storyList.map((story) => (
            <StoryItemCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center mt-6">
          {!loading && <p className="text-xl">No stories available.</p>}
        </div>
      )}
      {hasMore && !loading && (
        <div className="text-center mt-10">
          <Button className="" color="primary" onPress={loadMore}>
            Load More
          </Button>
        </div>
      )}
      <CustomLoader isLoading={loading} />
    </div>
  )
}
