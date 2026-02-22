import { z } from 'zod';

export const ideaSchema = z.object({
    title: z.string(),
    angle: z.string(),
    type: z.enum(['educational', 'opinion', 'storytelling', 'practical-tip']),
    estimatedEngagement: z.enum(['low', 'medium', 'high']),
});

export const ideasResponseSchema = z.array(ideaSchema);

export type Idea = z.infer<typeof ideaSchema>;

export const postSchema = z.object({
    hook: z.string(),
    body: z.string(),
    cta: z.string(),
    hashtags: z.array(z.string()),
});

export type Post = z.infer<typeof postSchema>;
