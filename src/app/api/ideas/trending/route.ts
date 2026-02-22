import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeTrends } from '@/lib/youtube';
import { fetchGitHubTrends } from '@/lib/github';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const topic = searchParams.get('topic');

    if (!topic) {
        return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    try {
        const [youtubeContext, githubContext] = await Promise.all([
            fetchYouTubeTrends(topic),
            fetchGitHubTrends(topic),
        ]);

        const context = `
YouTube Trends:
${youtubeContext}

GitHub Trends:
${githubContext}
    `.trim();

        return NextResponse.json({ context });
    } catch (error: any) {
        console.error('API Trending error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch trends', details: error.message },
            { status: 500 }
        );
    }
}
