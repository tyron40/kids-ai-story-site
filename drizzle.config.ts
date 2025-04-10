import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./config/schema.tsx",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:XJrpcIz2U3HO@ep-dry-dew-a580vg1u.us-east-2.aws.neon.tech/ai-kids-story-builder?sslmode=require",
  },
  verbose: true,
  strict: true,
})
