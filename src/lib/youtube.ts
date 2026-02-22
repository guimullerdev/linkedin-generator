function getThirtyDaysAgo(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString();
}

export async function fetchYouTubeTrends(topic: string): Promise<string> {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        console.warn('YOUTUBE_API_KEY is not defined. Skipping YouTube trends.');
        return '';
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('q', topic);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('type', 'video');
    url.searchParams.set('maxResults', '8');
    url.searchParams.set('order', 'viewCount');
    url.searchParams.set('publishedAfter', getThirtyDaysAgo());

    try {
        const res = await fetch(url.toString());
        if (!res.ok) {
            console.error('YouTube API error:', await res.text());
            return '';
        }
        const data = await res.json();

        return data.items
            .map((item: any) =>
                `- ${item.snippet.title}: ${item.snippet.description?.slice(0, 100)}`
            )
            .join('\n');
    } catch (error) {
        console.error('Failed to fetch YouTube trends:', error);
        return '';
    }
}
