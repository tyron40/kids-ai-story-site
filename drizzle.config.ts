import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

const databaseUrl = process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL or NEXT_PUBLIC_DATABASE_URL environment variable is required")
}

// Parse connection string
const connectionString = new URL(databaseUrl)

export default {
  schema: "./config/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: connectionString.hostname,
    port: parseInt(connectionString.port || "5432"),
    user: connectionString.username,
    password: connectionString.password,
    database: connectionString.pathname.substring(1),
    ssl: {
      rejectUnauthorized: false // Required for some hosting platforms
    }
  },
  strict: true,
  verbose: true,
} satisfies Config
