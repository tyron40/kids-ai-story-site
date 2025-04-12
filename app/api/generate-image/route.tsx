import { NextResponse } from "next/server"

// This route is deprecated. Use /api/generate-image/start and /api/generate-image/status instead
export async function POST() {
  return NextResponse.json(
    { 
      error: "This endpoint is deprecated. Please use /api/generate-image/start to initiate image generation and /api/generate-image/status to check status.",
      newEndpoints: {
        start: "/api/generate-image/start",
        status: "/api/generate-image/status"
      }
    },
    { status: 410 }
  )
}
