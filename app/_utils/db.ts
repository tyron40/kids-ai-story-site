import { db } from "@/config/db"
import { GAIStoryData } from "@/config/GeminiAi"
import { StoryData, Users } from "@/config/schema"
import { desc, eq } from "drizzle-orm"

export type StoryItem = typeof StoryData.$inferSelect
type StoryCreateParams = Omit<StoryItem, "id">

export type UserInsertProps = typeof Users.$inferInsert

interface PagedResults {
  limit: number
  offset: number
}

export async function getStories(params: PagedResults) {
  return await db
    .select()
    .from(StoryData)
    .orderBy(desc(StoryData.id))
    .limit(params.limit)
    .offset(params.offset)
}

export async function getStory(id: string) {
  const [result] = await db
    .select()
    .from(StoryData)
    .where(eq(StoryData.storyId, id))

  return result
}

export async function updateStory(
  id: number,
  updates: {
    output?: GAIStoryData
    coverImage?: string
    skinColor?: string
  }
) {
  const result = await db
    .update(StoryData)
    .set(updates)
    .where(eq(StoryData.id, id))

  return result
}

export async function getUserStories(emailAddress: string) {
  return await db
    .select()
    .from(StoryData)
    .where(eq(StoryData.userEmail, emailAddress))
    .orderBy(desc(StoryData.id))
}

export async function createStory(params: StoryCreateParams) {
  return await db
    .insert(StoryData)
    .values(params)
    .returning({ storyId: StoryData.storyId })
}

export async function getUser(email: string) {
  const [result] = await db
    .select()
    .from(Users)
    .where(eq(Users.userEmail, email))
  return result
}

export async function createUser(
  emailAddress?: string,
  imageUrl?: string,
  name?: string | null
) {
  const [result] = await db
    .insert(Users)
    .values({
      userEmail: emailAddress,
      userImage: imageUrl,
      userName: name,
    })
    .returning({
      userEmail: Users.userEmail,
      userName: Users.userName,
      userImage: Users.userImage,
      credit: Users.credit,
    })
  return result
}

export async function updateUserCredits(userEmail: string, credit: number) {
  const result = await db
    .update(Users)
    .set({
      credit,
    })
    .where(eq(Users.userEmail, userEmail))

  return result
}
