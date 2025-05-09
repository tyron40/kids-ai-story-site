import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Use DATABASE_URL instead of NEXT_PUBLIC_DATABASE_URL for security
const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql, { schema })
