import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        trendsEnabled:
            Boolean(process.env.YOUTUBE_API_KEY) &&
            Boolean(process.env.GITHUB_TOKEN),
    })
}
