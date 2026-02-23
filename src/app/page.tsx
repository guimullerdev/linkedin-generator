"use client";

import { useState, useEffect } from "react";
import { TopicForm } from "@/components/topic-form/TopicForm";
import { IdeaList } from "@/components/idea-list/IdeaList";
import { PostEditor } from "@/components/post-editor/PostEditor";
import { LoadingCard, EmptyState } from "@/components/shared";
import { Idea, Post } from "@/schemas";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useUsage } from "@/hooks/useUsage";
import { ideasStore } from "@/lib/storage/ideas.store";
import { postsStore } from "@/lib/storage/posts.store";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Rocket, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const { user, plan, loading: authLoading } = useAuth();
  const { isAtLimit, refetch: refetchUsage } = useUsage(user?.id, plan);

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate ideas");
      }

      const data = await res.json();
      const ideasWithTopic = data.map((idea: any) => ({ ...idea, topic: values.topic }));
      setIdeas(ideasWithTopic);
      refetchUsage();

      // Save to IndexedDB
      if (user) {
        ideasWithTopic.forEach((idea: any) => {
          ideasStore.save({
            ...idea,
            id: Math.random().toString(36).substring(7),
            userId: user.id,
            createdAt: new Date().toISOString(),
            saved: false
          });
        });
      }
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

    try {
      const res = await fetch("/api/post/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to generate post");
      }

      const data = await res.json();
      setPost(data);
      refetchUsage();

      // Save to IndexedDB
      if (user) {
        postsStore.save({
          ...data,
          id: Math.random().toString(36).substring(7), // In V1.2 we'll have real IDs
          userId: user.id,
          topic: (idea as any).topic || 'General',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      // Scroll to editor
      setTimeout(() => {
        document.getElementById("post-editor")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error: any) {
      toast.error(error.message || "An error occurred while generating the post");
    } finally {
      setIsLoadingPost(false);
    }
  };

  const handleRewrite = async (mode: string) => {
    if (!post) return;
    setIsRewriting(true);

    try {
      const res = await fetch("/api/post/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post, mode }),
      });

      if (!res.ok) throw new Error("Failed to rewrite post");
      const data = await res.json();
      setPost(data);
      toast.success(`Post rewritten in ${mode} mode!`);
    } catch (error: any) {
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
            Strategic technology content for developers. Build your personal brand with AI-powered insights.
          </p>
        </div>

        {/* Limit Reached Banner */}
        {isAtLimit && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-900">
            <Lock className="h-4 w-4 text-amber-600" />
            <AlertTitle className="font-bold flex items-center justify-between">
              Daily limit reached ({plan})
              <Button size="sm" variant="outline" className="h-7 text-xs bg-white hover:bg-amber-100 border-amber-300">
                <Rocket className="w-3 h-3 mr-1" /> Upgrade
              </Button>
            </AlertTitle>
            <AlertDescription className="text-amber-800">
              You&apos;ve used all your generations for today. Your limit will reset at midnight UTC.
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Form */}
        <section className={cn(
          "bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-opacity",
          isAtLimit && "opacity-60 pointer-events-none"
        )}>
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
