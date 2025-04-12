import { StoryItem } from "@/app/_utils/db"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { ForwardedRef, forwardRef } from "react"

import StoryPDF from "./StoryPDF"

interface StoryLastPageProps {
  story: StoryItem
}

const StoryLastPage = forwardRef(
  (props: StoryLastPageProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div className="bg-primary p-10 h-full" ref={ref}>
        <h2 className="text-center text-2xl text-white">End</h2>
        {props.story && (
          <PDFDownloadLink
            document={<StoryPDF story={props.story} />}
            fileName="story.pdf"
            className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent active:scale-[0.97] outline-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-default text-default-foreground hover:opacity-hover"
          >
            {({ loading }) => (loading ? "Loading..." : "Share")}
          </PDFDownloadLink>
        )}
      </div>
    )
  }
)

StoryLastPage.displayName = "StoryLastPage"

export default StoryLastPage
