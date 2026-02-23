"use client";

import { useState } from "react";
import { TopicForm } from "@/components/topic-form/TopicForm";
import { IdeaList } from "@/components/idea-list/IdeaList";
import { PostEditor } from "@/components/post-editor/PostEditor";
import { LoadingCard, EmptyState } from "@/components/shared";
import { Idea, Post } from "@/schemas";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  const handleGenerateIdeas = async (values: any) => {
    setIsLoadingIdeas(true);
    setIdeas([]);
    setSelectedIdea(null);
    setPost(null);

    try {
      let trendingContext = "";
      if (values.useTrending) {
        const trendRes = await fetch(`/api/ideas/trending?topic=${encodeURIComponent(values.topic)}`);
        const trendData = await trendRes.json();
        trendingContext = trendData.context;
      }

      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: values.topic,
          level: values.level,
          trendingContext
        }),
      });

      if (!res.ok) throw new Error("Failed to generate ideas");
      const data = await res.json();
      setIdeas(data);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while generating ideas");
    } finally {
      setIsLoadingIdeas(false);
    }
  };

  const handleSelectIdea = async (idea: Idea) => {
    setSelectedIdea(idea);
    setIsLoadingPost(true);
    setPost(null);

    setTimeout(() => {
      document.getElementById("post-editor")?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      const res = await fetch("/api/post/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) throw new Error("Failed to generate post");
      const data = await res.json();
      setPost(data);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while generating the post");
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleRewrite = async (mode: string) => {
    if (!post || isRewriting) return;
    setIsRewriting(true);
    setRewriteError(null);

    try {
      const res = await fetch("/api/post/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post, mode }),
      });

      if (!res.ok) throw new Error("Failed to rewrite post");
      const data = await res.json();
      setPost({
        ...data,
        rewrittenAt: new Date().toISOString()
      });
      toast.success(`Post rewritten in ${mode} mode!`);
    } catch (error: any) {
      setRewriteError(error.message || "Something went wrong.");
      toast.error(error.message || "An error occurred while rewriting the post");
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            LinkedIn Content Generator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Your code ships. Your ideas should too.
          </p>
        </div>

        {/* Step 1: Form */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">1</span>
            Define your topic
          </h2>
          <TopicForm onSubmit={handleGenerateIdeas} isLoading={isLoadingIdeas} />
        </section>

        {/* Step 2: Ideas */}
        {(isLoadingIdeas || ideas.length > 0) && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">2</span>
              Choose an idea
            </h2>
            {isLoadingIdeas ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => <LoadingCard key={i} />)}
              </div>
            ) : (
              <IdeaList
                ideas={ideas}
                onSelect={handleSelectIdea}
                selectedIdea={selectedIdea}
              />
            )}
          </section>
        )}

        {/* Step 3: Editor */}
        {(isLoadingPost || post) && (
          <section id="post-editor" className="space-y-6 scroll-mt-12">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs">3</span>
              Refine your post
            </h2>
            {isLoadingPost ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-[400px] w-full" />
              </div>
            ) : (
              post && (
                <PostEditor
                  post={post}
                  onUpdate={setPost}
                  onRewrite={handleRewrite}
                  isRewriting={isRewriting}
                  rewriteError={rewriteError}
                />
              )
            )}
          </section>
        )}

        {ideas.length === 0 && !isLoadingIdeas && !post && (
          <EmptyState message="Generate some ideas to get started!" />
        )}
      </div>
    </main>
  );
}
