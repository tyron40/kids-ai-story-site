import { StoryItem } from "@/app/_utils/db"
import { Chapter } from "@/config/schema"
import { Page, Image, Text, View, Document } from "@react-pdf/renderer"
import { useMemo } from "react"
import { createTw } from "react-pdf-tailwind"

const tw = createTw({
  theme: {
    extend: {
      colors: {
        primary: "#5253A3",
      },
    },
  },
})

function ChapterElement({ chapter }: { chapter: Chapter }) {
  return (
    <View style={tw("w-full flex justify-center items-center py-4")}>
      {chapter.chapter_image && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          src={chapter.chapter_image}
          style={{
            width: 300,
            height: 300,
            marginBottom: 24,
          }}
        />
      )}
      <Text style={tw("text-2xl font-bold text-primary flex justify-between")}>
        {chapter.chapter_title ?? ""}
      </Text>
      <Text style={tw("text-lg p-10 mt-3 rounded-lg bg-slate-100")}>
        {chapter.chapter_text ?? ""}
      </Text>
    </View>
  )
}

export default function StoryPDF({ story }: { story: StoryItem }) {
  const title = story.output.story_cover.title ?? ""

  const chapters = useMemo(() => {
    return story.output.chapters.map((chapter, index) => {
      return <ChapterElement key={index} chapter={chapter} />
    })
  }, [story])

  return (
    <Document>
      <Page>
        <View>
          <Text
            style={tw(
              "font-bold text-4xl text-center p-10 pb-0 bg-primary text-white"
            )}
          >
            {title}
          </Text>
        </View>
        <View style={tw("w-full flex justify-center items-center")}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={story.coverImage} style={{ width: 500, height: 500 }} />
        </View>
      </Page>
      {chapters.map((chapter, index) => (
        <Page key={index} style={tw("p-10")}>
          {chapter}
        </Page>
      ))}
    </Document>
  )
}
