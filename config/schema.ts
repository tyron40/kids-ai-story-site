import {
  integer,
  json,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core"
import { type GAIChapter, type GAIStoryData } from "./GeminiAi"

// Use type for type exports
export type Chapter = GAIChapter

// Use const for table definitions
export const StoryData = pgTable("storyData", {
  id: serial("id").primaryKey(),
  storyId: varchar("storyId").notNull(),
  storySubject: text("storySubject"),
  storyType: varchar("storyType"),
  ageGroup: varchar("ageGroup"),
  imageStyle: varchar("imageStyle"),
  skinColor: varchar("skinColor"),
  output: json("output").$type<GAIStoryData>().notNull(),
  coverImage: varchar("coverImage").notNull(),
  userEmail: varchar("userEmail"),
  userName: varchar("userName"),
  userImage: varchar("userImage"),
})

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  userName: varchar("userName"),
  userEmail: varchar("userEmail"),
  userImage: varchar("userImage"),
  credit: integer("credits").default(3),
})
