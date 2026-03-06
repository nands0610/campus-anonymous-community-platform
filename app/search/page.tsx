"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import PostCard, { type PostType } from "@/components/feed/PostCard";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type DBPost = {
    id: string;
    title: string | null;
    body: string;
    type: "confession" | "advice";
    created_at: string;
    published_at: string | null;
    user_tags: string[] | null;
    is_anonymous: boolean;
    profiles: { alias: string }[] | null;
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

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const supabase = useMemo(() => createClient(), []);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<DBPost[]>([]);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!query.trim()) {
                setPosts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const { data, error: dbError } = await supabase
                .from("posts")
                .select(
                    "id,title,body,type,created_at,published_at,user_tags,status,is_anonymous,profiles:author_id ( alias )"
                )
                .eq("status", "published")
                .neq("type", "poll");

            if (cancelled) return;

            if (dbError) {
                setError(dbError.message);
                setPosts([]);
                setLoading(false);
                return;
            }

            // Client-side filtering for title and tags
            const searchLower = query.toLowerCase();
            const filtered = (data ?? []).filter((post: DBPost) => {
                const titleMatch = post.title?.toLowerCase().includes(searchLower) ?? false;
                const tagsMatch = (post.user_tags ?? []).some((tag) =>
                    tag.toLowerCase().includes(searchLower)
                );
                return titleMatch || tagsMatch;
            });

            setPosts((filtered as DBPost[]).sort((a, b) => {
                const aDate = new Date(b.published_at ?? b.created_at).getTime();
                const bDate = new Date(a.published_at ?? a.created_at).getTime();
                return aDate - bDate;
            }));

            setLoading(false);
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [query, supabase]);

    const cardPosts = posts.map((p) => {
        const alias = Array.isArray((p as any).profiles)
            ? (p as any).profiles[0]?.alias
            : (p as any).profiles?.alias;

        return {
            id: p.id,
            username: p.is_anonymous || !alias ? "Anonymous" : `@${alias}`,
            time: timeAgo(p.published_at ?? p.created_at),
            title: p.title ?? "",
            content: p.body,
            type: mapPostType(p.type),
            tags: (p.user_tags ?? []).slice(0, 6),
            reactions: 0,
            comments: 0,
        };
    });

    return (
        <FeedLayout>
            <div className="mb-8">
                <Link
                    href="/feed"
                    className="flex items-center gap-2 text-primary hover:text-blue-700 transition-all mb-6 font-semibold text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed
                </Link>

                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Results</h1>
                    {query.trim() && (
                        <p className="text-slate-500">
                            {!loading && (
                                <span className="ml-2">
                                    ({cardPosts.length} {cardPosts.length === 1 ? "result" : "results"})
                                </span>
                            )}
                        </p>
                    )}
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-slate-500 font-medium">Searching...</div>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center py-20">
                    <div className="text-red-600 font-medium">{error}</div>
                </div>
            )}

            {!loading && !error && !query.trim() && (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-slate-500 mb-4">Enter a search query to find posts</p>
                </div>
            )}

            {!loading && !error && query.trim() && cardPosts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-slate-500 mb-4">No posts found matching "{query}"</p>
                    <Link href="/feed" className="text-primary hover:underline font-semibold text-sm">
                        Browse all posts
                    </Link>
                </div>
            )}

            {!loading && !error && cardPosts.length > 0 && (
                <div>
                    {cardPosts.map((post) => (
                        <PostCard key={post.id} {...post} />
                    ))}
                </div>
            )}
        </FeedLayout>
    );
}
