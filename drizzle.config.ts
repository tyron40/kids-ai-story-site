import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required")
}

// Parse connection string
const connectionString = new URL(process.env.DATABASE_URL)

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
    ssl: "require"  // Using the string literal type as specified in the error
  },
  strict: true,
  verbose: true,
} satisfies Config
