import { Idea } from "@/schemas";

export const ideasPrompt = (topic: string, level: string) => `
You are a content strategist specialized in technology for LinkedIn.

Generate exactly 8 LinkedIn post ideas about the topic: "${topic}"
Target audience: ${level}-level developers.

Strict Requirements:
1. Respond ONLY with a valid JSON array.
2. DO NOT use markdown code blocks (like \`\`\`json).
3. NO conversational text, NO explanations, NO intro/outro.
4. Ensure the JSON is perfectly formatted.

Expected JSON format:
[
  {
    "title": "attractive post title",
    "angle": "specific approach or angle",
    "type": "educational | opinion | storytelling | practical-tip",
    "estimatedEngagement": "low | medium | high"
  }
]
`;

export const trendingIdeasPrompt = (topic: string, context: string) => `
You are a LinkedIn content strategist specialized in technology.

Based on the real market trends below about "${topic}", generate exactly 8
relevant and current post ideas for developers.

=== CURRENT MARKET CONTEXT ===
${context}
==============================

Strict Requirements:
1. Respond ONLY with a valid JSON array.
2. DO NOT use markdown code blocks (like \`\`\`json).
3. NO conversational text, NO explanations, NO intro/outro.
4. Ensure the JSON is perfectly formatted.

Expected JSON format:
[
  {
    "title": "attractive post title",
    "angle": "specific approach or angle",
    "type": "educational | opinion | storytelling | practical-tip",
    "estimatedEngagement": "low | medium | high"
  }
]
`;

export const generatePostPrompt = (idea: Idea, persona?: string) => `
You are a copywriter specialized in LinkedIn content focused on technology.

Generate a complete LinkedIn post based on this idea:
Title: ${idea.title}
Angle: ${idea.angle}
Type: ${idea.type}
${persona ? `Author persona: ${persona}` : ''}

Post rules:
- Impactful hook on the first line (appears before "see more")
- Short paragraphs (maximum 3 lines each)
- Human, direct tone — no corporate jargon
- Between 150 and 300 words total
- Genuine CTA at the end (question or reflection)
- Between 5 and 8 relevant hashtags

Strict Requirements:
1. Respond ONLY with valid JSON.
2. DO NOT use markdown code blocks (like \`\`\`json).
3. NO conversational text, NO explanations, NO intro/outro.

Expected JSON format:
{
  "hook": "first line of the post",
  "body": "full post body",
  "cta": "call to action",
  "hashtags": ["hash1", "hash2"]
}
`;

export const rewritePostPrompt = (post: any, mode: string) => `
You are a LinkedIn content expert. Rewrite the following post using the specified mode.

Post:
Hook: ${post.hook}
Body: ${post.body}
CTA: ${post.cta}
Hashtags: ${post.hashtags.join(', ')}

Mode: ${mode}
(Available modes: technical, accessible, short, storytelling, english)

Respond ONLY with valid JSON, no markdown, no explanations:
{
  "hook": "rewritten hook",
  "body": "rewritten body",
  "cta": "rewritten cta",
  "hashtags": ["hash1", "hash2"]
}
`;
