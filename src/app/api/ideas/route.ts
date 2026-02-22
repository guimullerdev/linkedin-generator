import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { callOpenRouter } from '@/lib/openrouter';
import { ideasPrompt, trendingIdeasPrompt } from '@/lib/prompts';
import { ideasResponseSchema } from '@/schemas';

const bodySchema = z.object({
    topic: z.string().min(2).max(100),
    level: z.enum(['beginner', 'intermediate', 'advanced']).default('intermediate'),
    trendingContext: z.string().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.json();
        const parsed = bodySchema.safeParse(rawBody);

        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const { topic, level, trendingContext } = parsed.data;

        let prompt;
        if (trendingContext) {
            prompt = trendingIdeasPrompt(topic, trendingContext);
        } else {
            prompt = ideasPrompt(topic, level);
        }

        const aiResponse = await callOpenRouter(prompt);
        let ideas;

        try {
            // Attempt to parse JSON from AI response (sometimes it includes markdown or extra text)
            const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
            const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
            ideas = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON Parse Error in Ideas API:', parseError);
            console.error('Raw AI Response:', aiResponse);
            throw new Error('AI returned an invalid JSON format for ideas');
        }

        const validatedIdeas = ideasResponseSchema.parse(ideas);

        return NextResponse.json(validatedIdeas);
    } catch (error: any) {
        console.error('API Ideas error:', error);
        return NextResponse.json(
            { error: 'Failed to generate ideas', details: error.message },
            { status: 500 }
        );
    }
}
