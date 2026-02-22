export async function fetchGitHubTrends(topic: string): Promise<string> {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
        Accept: 'application/vnd.github+json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    } else {
        console.warn('GITHUB_TOKEN is not defined. Rate limits will be restricted.');
    }

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(topic)}&sort=updated&per_page=5`;

    try {
        const res = await fetch(url, { headers });
        if (!res.ok) {
            console.error('GitHub API error:', await res.text());
            return '';
        }
        const data = await res.json();

        return data.items
            .map((repo: any) => `- ${repo.full_name}: ${repo.description || 'No description'}`)
            .join('\n');
    } catch (error) {
        console.error('Failed to fetch GitHub trends:', error);
        return '';
    }
}
