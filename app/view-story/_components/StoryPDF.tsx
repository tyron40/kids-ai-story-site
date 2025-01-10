import { Page, Image, Text, View, Document } from "@react-pdf/renderer";
import { useMemo } from "react";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        primary: "#5253A3",
      },
    },
  },
});

export default function StoryPDF({ story }: { story: any }) {
  const title = story?.output?.story_cover?.title;

  const chapters = useMemo(() => {
    return story?.output?.chapters ? story.output.chapters : [];
  }, [story]);

  return (
    <Document>
      <Page size="A4">
        <View>
          <Text
            style={tw(
              "font-bold text-4xl text-center p-10 pb-0 bg-primary text-white"
            )}
          >
            {title}
          </Text>
        </View>
        <View style={tw("w-100 flex justify-center items-center")}>
          <Image src={story?.coverImage} style={{ width: 500, height: 500 }} />
        </View>
        <View style={tw("p-10")}>
          {chapters.map((chapter: any, index: number) => (
            <View key={index} style={tw("py-3")}>
              <Text
                style={tw(
                  "text-2xl fontbold text-primary flex justify-between"
                )}
              >
                {chapter.chapter_title ?? ""}
              </Text>
              <Text
                style={tw(
                  "text-lg p-10 mt-3 rounded-lg bg-slate-100 line-clamp-[10]"
                )}
              >
                {chapter.chapter_text ?? ""}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
