"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import PostCard, { type PostType } from "@/components/feed/PostCard";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";

type DBPost = {
    id: string;
    title: string | null;
    body: string;
    type: "confession" | "advice";
    created_at: string;
    published_at: string | null;
    user_tags: string[] | null;
    is_anonymous: boolean;
    profiles: {
        alias: string;
    } | null;
};

function mapPostType(t: DBPost["type"]): PostType {
    return t === "confession" ? "Confession" : "Advice";
}

function timeAgo(iso: string) {
    const now = Date.now();
    const t = new Date(iso).getTime();
    const diff = Math.max(0, now - t);

    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} mins ago`;

    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;

    const days = Math.floor(hrs / 24);
    return `${days} days ago`;
}

export default function FeedPage() {
    const supabase = useMemo(() => createClient(), []);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<DBPost[]>([]);
    const [feedFilter, setFeedFilter] = useState<
        "all" | "confession" | "advice"
    >("all");

    useEffect(() => {
        let cancelled = false;

        async function load() {
        setLoading(true);
        setError(null);

        let query = supabase
            .from("posts")
            .select(
            "id,title,body,type,created_at,published_at,user_tags,status,is_anonymous,profiles:author_id ( alias )"
            )
            .eq("status", "published")
            .order("published_at", { ascending: false, nullsFirst: false })
            .limit(30);

        if (feedFilter !== "all") {
            query = query.eq("type", feedFilter);
        }

        const { data, error } = await query;

        if (cancelled) return;

        if (error) {
            setError(error.message);
            setPosts([]);
        } else {
            setPosts((data ?? []) as DBPost[]);
        }

        setLoading(false);
        }

        load();
        return () => {
        cancelled = true;
        };
    }, [supabase, feedFilter]);

    const cardPosts = posts.map((p) => ({
        id: p.id,
        username: p.is_anonymous || !p.profiles
            ? "Anonymous"
            : `@${p.profiles.alias}`,
        time: timeAgo(p.published_at ?? p.created_at),
        title: p.title ?? "",
        content: p.body,
        type: mapPostType(p.type),
        tags: (p.user_tags ?? []).slice(0, 6),
        reactions: 0,
        comments: 0,
    }));

    return (
        <FeedLayout>
        <div className="space-y-6">
            {/* FILTER TOGGLE */}
            <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => setFeedFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                feedFilter === "all"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
                All
            </button>

            <button
                type="button"
                onClick={() => setFeedFilter("confession")}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                feedFilter === "confession"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
                Confessions
            </button>

            <button
                type="button"
                onClick={() => setFeedFilter("advice")}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                feedFilter === "advice"
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
            >
                Advice
            </button>
            </div>

            {error ? (
            <div className="p-4 border border-red-200 bg-red-50 rounded-xl text-sm font-bold text-red-700">
                {error}
            </div>
            ) : null}

            {loading ? (
            <div className="text-sm font-bold text-slate-400">
                Loading posts...
            </div>
            ) : (
            <div className="space-y-4">
                {cardPosts.length === 0 ? (
                <div className="text-sm font-bold text-slate-400">
                    No posts yet. Be the first to post.
                </div>
                ) : (
                cardPosts.map((post) => (
                    <PostCard key={post.id} {...post} />
                ))
                )}
            </div>
            )}

            <div className="text-center py-12">
            <button className="text-sm font-bold text-slate-400 hover:text-primary transition-all">
                Show older posts
            </button>
            </div>
        </div>
        </FeedLayout>
    );
}