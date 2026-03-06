"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import FeedLayout from "@/components/feed/FeedLayout";
import PostCard from "@/components/feed/PostCard";
import { useRouter } from "next/navigation";

interface SavedPost {
    id: string;
    user_id: string;
    username: string;
    title: string;
    content: string;
    type: "Confession" | "Advice";
    user_tags: string[];
    reaction_count: number;
    comment_count: number;
    published_at: string;
}

export default function SavedPostsPage() {
    const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    async function fetchSavedPosts() {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session?.user?.id) {
                router.push("/auth/login");
                return;
            }

            // Get saved post IDs
            const { data: savedIds, error: savedError } = await supabase
                .from("saved_posts")
                .select("post_id")
                .eq("user_id", sessionData.session.user.id)
                .order("created_at", { ascending: false });

            if (savedError) throw savedError;

            if (!savedIds || savedIds.length === 0) {
                setSavedPosts([]);
                setLoading(false);
                return;
            }

            // Get post details for all saved posts
            const postIds = savedIds.map((item) => item.post_id);
            const { data: posts, error: postsError } = await supabase
                .from("posts")
                .select("*")
                .in("id", postIds)
                .eq("status", "published")
                .order("published_at", { ascending: false });

            if (postsError) throw postsError;

            setSavedPosts(posts || []);
        } catch (err) {
            console.error("Failed to fetch saved posts:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSavedPosts();
    }, [supabase, router]);

    function timeAgo(dateString: string) {
        const date = new Date(dateString);
        const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + "y";
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + "mo";
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + "d";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + "h";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + "m";
        return Math.floor(seconds) + "s";
    }

    return (
        <FeedLayout>
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-4 md:p-6 md:pt-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Saved Posts</h1>
                    <p className="text-sm text-slate-500 mb-6">
                        {savedPosts.length} saved post{savedPosts.length !== 1 ? "s" : ""}
                    </p>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-slate-400">Loading...</p>
                        </div>
                    ) : savedPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 mb-2">No saved posts yet</p>
                            <p className="text-xs text-slate-400">
                                Click the bookmark icon on posts to save them
                            </p>
                        </div>
                    ) : (
                        <div>
                            {savedPosts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    id={post.id}
                                    username={post.username}
                                    time={timeAgo(post.published_at)}
                                    title={post.title}
                                    content={post.content}
                                    type={post.type}
                                    tags={post.user_tags || []}
                                    reactions={post.reaction_count || 0}
                                    comments={post.comment_count || 0}
                                    onSaveToggle={() => {
                                        setLoading(true);
                                        fetchSavedPosts();
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FeedLayout>
    );
}
