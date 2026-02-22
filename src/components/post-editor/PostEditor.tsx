"use client";

import { Post } from "@/schemas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostActions } from "./PostActions";

interface PostEditorProps {
    post: Post;
    onUpdate: (post: Post) => void;
    onRewrite: (mode: string) => void;
    isRewriting: boolean;
}

export function PostEditor({ post, onUpdate, onRewrite, isRewriting }: PostEditorProps) {
    const handleChange = (field: keyof Post, value: string) => {
        if (field === 'hashtags') {
            onUpdate({ ...post, hashtags: value.split(',').map(h => h.trim()) });
        } else {
            onUpdate({ ...post, [field]: value });
        }
    };

    const fullPostBody = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(h => `#${h.replace('#', '')}`).join(' ')}`;

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">Post Editor</CardTitle>
                <PostActions
                    post={post}
                    onRewrite={onRewrite}
                    isRewriting={isRewriting}
                />
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="edit">Edit Content</TabsTrigger>
                    </TabsList>
                    <TabsContent value="preview" className="mt-4">
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap font-sans text-sm min-h-[300px]">
                            {fullPostBody}
                        </div>
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
                            <Textarea
                                value={post.body}
                                onChange={(e) => handleChange('body', e.target.value)}
                                placeholder="Body"
                                className="min-h-[150px]"
                            />
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
    );
}
