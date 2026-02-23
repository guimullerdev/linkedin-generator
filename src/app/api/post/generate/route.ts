import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { generatePostPrompt } from '@/lib/prompts';
import { postSchema } from '@/schemas';
import { createClient } from '@/lib/supabase/server';
import { checkAndIncrementUsage } from '@/lib/usage';

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const usage = await checkAndIncrementUsage(session.user.id);

        if (!usage.allowed) {
            return NextResponse.json({
                error: 'Daily limit reached',
                plan: usage.plan,
                limit: usage.limit,
                resetAt: 'midnight UTC',
            }, { status: 429 });
        }
        const { idea, persona } = await req.json();

        if (!idea) {
            return NextResponse.json({ error: 'Idea is required' }, { status: 400 });
        }

        const prompt = generatePostPrompt(idea, persona);
        const aiResponse = await callOpenRouter(prompt);
        let post;

        try {
            const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
            post = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error('JSON Parse Error in Post Generate API:', parseError);
            console.error('Raw AI Response:', aiResponse);
            throw new Error('AI returned an invalid JSON format for the post');
        }

        const validatedPost = postSchema.parse(post);

        return NextResponse.json(validatedPost);
    } catch (error: any) {
        console.error('API Post Generate error:', error);
        return NextResponse.json(
            { error: 'Failed to generate post', details: error.message },
            { status: 500 }
        );
    }
}
