import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/openrouter';
import { rewritePostPrompt } from '@/lib/prompts';
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

        const usage = await checkAndIncrementUsage(session.user.id, true);

        if (!usage.allowed) {
            return NextResponse.json({
                error: 'Daily limit reached',
                plan: usage.plan,
                limit: usage.limit,
                resetAt: 'midnight UTC',
            }, { status: 429 });
        }
        const { post, mode } = await req.json();

        if (!post || !mode) {
            return NextResponse.json({ error: 'Post and mode are required' }, { status: 400 });
        }

        const prompt = rewritePostPrompt(post, mode);
        const aiResponse = await callOpenRouter(prompt);

        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse;
        const rewrittenPost = JSON.parse(jsonStr);

        const validatedPost = postSchema.parse(rewrittenPost);

        return NextResponse.json(validatedPost);
    } catch (error: any) {
        console.error('API Post Rewrite error:', error);
        return NextResponse.json(
            { error: 'Failed to rewrite post', details: error.message },
            { status: 500 }
        );
    }
}
