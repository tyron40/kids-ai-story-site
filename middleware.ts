import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { getStory } from "@/app/_utils/db"

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/create-story(.*)",
  "/edit-story(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { sessionClaims } = auth().protect()

    const { pathname } = req.nextUrl
    const isEditStoryPage = pathname.startsWith("/edit-story")
    if (isEditStoryPage) {
      const [, , storyId] = pathname.split("/")
      try {
        const story = await getStory(storyId)
        const userEmail = sessionClaims?.email

        // If story exists and user email doesn't match, redirect to dashboard
        if (story && userEmail && story.userEmail !== userEmail) {
          return Response.redirect(new URL("/", req.url))
        }
      } catch (error) {
        console.error("Error fetching story:", error)
        // If there's an error fetching the story, redirect to dashboard
        return Response.redirect(new URL("/", req.url))
      }
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
