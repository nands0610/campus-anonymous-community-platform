"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  MessageSquare,
  Share2,
  ThumbsUp,
  Sparkles,
  Send,
  User,
} from "lucide-react";

type PostRow = {
  id: string;
  title: string | null;
  body: string;
  type: "confession" | "advice";
  created_at: string;
  published_at: string | null;
  user_tags: string[] | null;
  status: "draft" | "published";
  is_anonymous: boolean;
  profiles: { alias: string }[] | null;
};

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

type ReactionKey = "like" | "helpful" | "relate";

type CommentUI = {
  id: string;
  username: string;
  time: string;
  body: string;
  likes: number;
};

export default function PostDetailPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? "");

  // Post loading (kept from your working version)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<PostRow | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!id) return;

      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          title,
          body,
          type,
          status,
          created_at,
          published_at,
          user_tags,
          is_anonymous,
          profiles:author_id ( alias )
        `
        )
        .eq("id", id)
        .eq("status", "published")
        .single();

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setPost(null);
      } else {
        setPost(data as PostRow);
      }
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, id]);

  const alias = post?.profiles?.[0]?.alias;
  const username = !post || post.is_anonymous || !alias ? "Anonymous" : `@${alias}`;

  // ---- UI ONLY: Reactions state (local)
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionKey, number>>({
    like: 24,
    helpful: 8,
    relate: 13,
  });
  const [myReaction, setMyReaction] = useState<ReactionKey | null>(null);

  function toggleReaction(key: ReactionKey) {
    setReactionCounts((prev) => {
      const next = { ...prev };

      // remove old reaction if exists
      if (myReaction && myReaction !== key) {
        next[myReaction] = Math.max(0, next[myReaction] - 1);
      }

      // toggle same reaction
      if (myReaction === key) {
        next[key] = Math.max(0, next[key] - 1);
        return next;
      }

      // set new reaction
      next[key] = next[key] + 1;
      return next;
    });

    setMyReaction((prev) => (prev === key ? null : key));
  }

  // ---- UI ONLY: Comments state (local)
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentUI[]>([
    {
      id: "c1",
      username: "Anonymous",
      time: "10 mins ago",
      body: "This is so real 😭 Hang in there.",
      likes: 12,
    },
    {
      id: "c2",
      username: "@nand_123",
      time: "22 mins ago",
      body: "If you want, I can share how I handled something similar.",
      likes: 5,
    },
  ]);

  function addComment() {
    const text = commentText.trim();
    if (!text) return;

    const newComment: CommentUI = {
      id: `local-${Date.now()}`,
      username: "@you",
      time: "just now",
      body: text,
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
  }

  function likeComment(commentId: string) {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // Optional: you can show a toast later
    } catch {}
  }

  return (
    <FeedLayout>
      <div className="max-w-2xl mx-auto">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-bold text-slate-400 hover:text-primary transition-all mb-6"
        >
          ← Back
        </button>

        {loading ? (
          <div className="text-sm font-bold text-slate-400">Loading post...</div>
        ) : error ? (
          <div className="p-4 border border-red-200 bg-red-50 rounded-xl text-sm font-bold text-red-700">
            {error}
          </div>
        ) : !post ? (
          <div className="text-sm font-bold text-slate-400">Post not found.</div>
        ) : (
          <div className="space-y-6">
            {/* POST CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{username}</p>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                      • {timeAgo(post.published_at ?? post.created_at)}
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase border border-slate-200 text-slate-600">
                  {post.type === "confession" ? "Confession" : "Advice"}
                </span>
              </div>

              {post.title ? (
                <h1 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">
                  {post.title}
                </h1>
              ) : null}

              <p className="text-slate-700 text-[16px] leading-relaxed whitespace-pre-line break-all overflow-hidden">
                {post.body}
              </p>

              {post.user_tags?.length ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.user_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-slate-200 text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* REACTIONS BAR (UI ONLY) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleReaction("like")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                      myReaction === "like"
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Like <span className="text-slate-400 font-extrabold">{reactionCounts.like}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleReaction("helpful")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                      myReaction === "helpful"
                        ? "bg-blue-50 border-blue-200 text-primary"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Helpful{" "}
                    <span className="text-slate-400 font-extrabold">{reactionCounts.helpful}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleReaction("relate")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                      myReaction === "relate"
                        ? "bg-purple-50 border-purple-200 text-purple-700"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Relate{" "}
                    <span className="text-slate-400 font-extrabold">{reactionCounts.relate}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={copyLink}
                  className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* COMMENTS (UI ONLY) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {comments.length} total
                </span>
              </div>

              {/* Comment composer */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full min-h-[90px] bg-transparent outline-none resize-none text-sm font-medium text-slate-700 placeholder:text-slate-400 break-all"
                />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[11px] font-bold text-slate-400">
                    Keep it respectful. No personal info.
                  </p>
                  <button
                    type="button"
                    onClick={addComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>

              {/* Comment list */}
              <div className="mt-6 space-y-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {c.username}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                          • {c.time}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => likeComment(c.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" />
                        {c.likes}
                      </button>
                    </div>

                    <p className="mt-4 text-sm text-slate-700 leading-relaxed whitespace-pre-line break-all">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </FeedLayout>
  );
}