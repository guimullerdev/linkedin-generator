"use client";

import { Post } from "@/schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostActions } from "./PostActions";
import { useScrollToRef } from "@/hooks/useScrollToRef";
import { useRewrittenFlash } from "@/hooks/useRewrittenFlash";
import { PostBodySkeleton } from "./PostBodySkeleton";
import { cn } from "@/lib/utils";

interface PostEditorProps {
    post: Post;
    onUpdate: (post: Post) => void;
    onRewrite: (mode: string) => void;
    isRewriting: boolean;
    rewriteError: string | null;
}

export function PostEditor({ post, onUpdate, onRewrite, isRewriting, rewriteError }: PostEditorProps) {
    const editorRef = useScrollToRef<HTMLDivElement>(post);
    const showFlash = useRewrittenFlash(post.rewrittenAt);

    const handleChange = (field: keyof Post, value: string) => {
        if (field === 'hashtags') {
            onUpdate({ ...post, hashtags: value.split(',').map(h => h.trim()) });
        } else {
            onUpdate({ ...post, [field]: value });
        }
    };

    const fullPostBody = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(h => `#${h.replace('#', '')}`).join(' ')}`;

    return (
        <div
            ref={editorRef}
            className="mt-8 scroll-mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">Post Editor</CardTitle>
                        {showFlash && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 animate-in fade-in zoom-in duration-150">
                                ✓ Rewritten
                            </span>
                        )}
                    </div>
                    <PostActions
                        post={post}
                        onRewrite={onRewrite}
                        isRewriting={isRewriting}
                        rewriteError={rewriteError}
                    />
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="preview" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="edit">Edit Content</TabsTrigger>
                        </TabsList>
                        <TabsContent value="preview" className="mt-4">
                            {isRewriting ? (
                                <PostBodySkeleton />
                            ) : (
                                <div className="bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap font-sans text-sm min-h-[300px] animate-in fade-in duration-300">
                                    {fullPostBody}
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="edit" className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500">Hook</label>
                                <Textarea
                                    value={post.hook}
                                    onChange={(e) => handleChange('hook', e.target.value)}
                                    placeholder="Hook"
                                    className="min-h-[60px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500">Body</label>
                                {isRewriting ? (
                                    <PostBodySkeleton />
                                ) : (
                                    <Textarea
                                        value={post.body}
                                        onChange={(e) => handleChange('body', e.target.value)}
                                        placeholder="Body"
                                        className="min-h-[150px] animate-in fade-in duration-300"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500">Call to Action</label>
                                <Textarea
                                    value={post.cta}
                                    onChange={(e) => handleChange('cta', e.target.value)}
                                    placeholder="CTA"
                                    className="min-h-[60px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-slate-500">Hashtags (comma separated)</label>
                                <Textarea
                                    value={post.hashtags.join(', ')}
                                    onChange={(e) => handleChange('hashtags', e.target.value)}
                                    placeholder="Hashtags"
                                    className="min-h-[40px]"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
