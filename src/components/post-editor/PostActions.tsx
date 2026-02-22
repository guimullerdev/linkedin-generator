"use client";

import { Post } from "@/schemas";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface PostActionsProps {
    post: Post;
    onRewrite: (mode: string) => void;
    isRewriting: boolean;
}

export function PostActions({ post, onRewrite, isRewriting }: PostActionsProps) {
    const copyToClipboard = () => {
        const fullPostBody = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(h => `#${h.replace('#', '')}`).join(' ')}`;
        navigator.clipboard.writeText(fullPostBody);
        toast.success("Post copied to clipboard!");
    };

    return (
        <div className="flex items-center gap-2">
            <Select onValueChange={onRewrite} disabled={isRewriting}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                    <SelectValue placeholder="Rewrite as..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="technical">More Technical</SelectItem>
                    <SelectItem value="accessible">Simpler</SelectItem>
                    <SelectItem value="short">Shorter</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={copyToClipboard}
                title="Copy to clipboard"
            >
                <Copy className="h-4 w-4" />
            </Button>
        </div>
    );
}
