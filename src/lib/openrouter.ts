export async function callOpenRouter(prompt: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not defined');
    }

    if (!model) {
        throw new Error('OPENROUTER_MODEL is not defined');
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000', // Update for production
            'X-Title': 'LinkedIn Content Generator',
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(`OpenRouter API error: ${JSON.stringify(error)}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
}
