"use client";

import { Post } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { RewriteSelect } from "./RewriteSelect";

interface PostActionsProps {
    post: Post;
    onRewrite: (mode: string) => void;
    isRewriting: boolean;
    rewriteError: string | null;
}

export function PostActions({ post, onRewrite, isRewriting, rewriteError }: PostActionsProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        const fullPostBody = `${post.hook}\n\n${post.body}\n\n${post.cta}\n\n${post.hashtags.map(h => `#${h.replace('#', '')}`).join(' ')}`;
        await navigator.clipboard.writeText(fullPostBody);
        setCopied(true);
        toast.success("Post copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <RewriteSelect
                    isRewriting={isRewriting}
                    onValueChange={onRewrite}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-8 gap-2 transition-all duration-200",
                        copied ? "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:text-white" : ""
                    )}
                    onClick={copyToClipboard}
                    title="Copy to clipboard"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4" />
                            <span className="text-xs font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4" />
                            <span className="text-xs font-medium">Copy post</span>
                        </>
                    )}
                </Button>
            </div>

            {rewriteError && (
                <p className="flex items-center gap-1.5 text-xs text-destructive animate-in fade-in duration-200">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    Rewrite failed. Original post preserved — try again.
                </p>
            )}
        </div>
    );
}
