import { Card, CardFooter } from "@nextui-org/card"
import Image from "next/image"
import { Button } from "@nextui-org/button"
import Link from "next/link"
import { StoryItem } from "@/app/_utils/db"

export default function StoryItemCard({ story }: { story: StoryItem }) {
  return (
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
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Read Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
