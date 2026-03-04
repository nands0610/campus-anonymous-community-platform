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
  Trash2,
} from "lucide-react";

type ReactionKey = "relate" | "support" | "helpful" | "funny";

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

type CommentRow = {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  is_anonymous: boolean;
  profiles: any; // join shape can vary; we normalize below
};

type CommentUI = {
  id: string;
  authorId: string;
  username: string;
  time: string;
  body: string;
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

// Handles both shapes:
// profiles: [{ alias: "x" }] OR profiles: { alias: "x" } OR null
function getAlias(joinedProfiles: any): string | undefined {
  if (!joinedProfiles) return undefined;
  return Array.isArray(joinedProfiles)
    ? joinedProfiles[0]?.alias
    : joinedProfiles?.alias;
}

export default function PostDetailPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id ?? "");

  const [meId, setMeId] = useState<string | null>(null);

  // post
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<PostRow | null>(null);

  // comments
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<CommentUI[]>([]);
  const [commentAnon, setCommentAnon] = useState(false);

  // reactions
  const [reactionCounts, setReactionCounts] = useState<Record<ReactionKey, number>>({
    relate: 0,
    support: 0,
    helpful: 0,
    funny: 0,
  });
  const [myReactions, setMyReactions] = useState<Set<ReactionKey>>(new Set());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMeId(data.user?.id ?? null));
  }, [supabase]);

  // load post
  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
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

    loadPost();
    return () => {
      cancelled = true;
    };
  }, [supabase, id]);

  const postAlias = post?.profiles?.[0]?.alias;
  const postUsername = !post || post.is_anonymous || !postAlias ? "Anonymous" : `@${postAlias}`;

  // load comments
  async function loadComments() {
    if (!id) return;
    setCommentLoading(true);

    const { data, error } = await supabase
      .from("comments")
      .select("id,body,created_at,author_id,is_anonymous,profiles:author_id ( alias )")
      .eq("post_id", id)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setCommentLoading(false);
      return;
    }

    const mapped: CommentUI[] = ((data ?? []) as CommentRow[]).map((c) => {
      const a = getAlias(c.profiles);
      const name = c.is_anonymous || !a ? "Anonymous" : `@${a}`;
      return {
        id: c.id,
        authorId: c.author_id,
        username: name,
        time: timeAgo(c.created_at),
        body: c.body,
      };
    });

    setComments(mapped);
    setCommentLoading(false);
  }

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // add comment
  async function addComment() {
    const text = commentText.trim();
    if (!text || !meId || !id) return;

    // capture current toggle value *at click time*
    const anon = commentAnon;

    setCommentText("");

    const optimisticId = `local-${Date.now()}`;
    setComments((prev) => [
      {
        id: optimisticId,
        authorId: meId,
        username: anon ? "Anonymous" : "@you",
        time: "just now",
        body: text,
      },
      ...prev,
    ]);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: id,
        author_id: meId,
        body: text,
        status: "published",
        is_anonymous: anon,
      })
      .select("id,body,created_at,author_id,is_anonymous,profiles:author_id ( alias )")
      .single();

    if (error) {
      setComments((prev) => prev.filter((c) => c.id !== optimisticId));
      console.error(error);
      return;
    }

    const row = data as CommentRow;
    const a = getAlias(row.profiles);
    const name = row.is_anonymous || !a ? "Anonymous" : `@${a}`;

    const real: CommentUI = {
      id: row.id,
      authorId: row.author_id,
      username: name,
      time: timeAgo(row.created_at),
      body: row.body,
    };

    setComments((prev) => [real, ...prev.filter((c) => c.id !== optimisticId)]);
  }

  async function deleteComment(commentId: string) {
    const prev = comments;
    setComments((cs) => cs.filter((c) => c.id !== commentId));

    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) {
      setComments(prev);
      console.error(error);
    }
  }

  // reactions
  async function loadReactions() {
    if (!id) return;

    const { data, error } = await supabase
      .from("post_reactions")
      .select("reaction,user_id")
      .eq("post_id", id);

    if (error) {
      console.error(error);
      return;
    }

    const counts: Record<ReactionKey, number> = {
      relate: 0,
      support: 0,
      helpful: 0,
      funny: 0,
    };
    const mine = new Set<ReactionKey>();

    for (const r of data ?? []) {
      const k = r.reaction as ReactionKey;
      counts[k] = (counts[k] ?? 0) + 1;
      if (meId && r.user_id === meId) mine.add(k);
    }

    setReactionCounts(counts);
    setMyReactions(mine);
  }

  useEffect(() => {
    loadReactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, meId]);

  async function toggleReaction(key: ReactionKey) {
    if (!meId) return;

    const has = myReactions.has(key);

    setMyReactions((prev) => {
      const next = new Set(prev);
      if (has) next.delete(key);
      else next.add(key);
      return next;
    });
    setReactionCounts((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + (has ? -1 : 1)),
    }));

    if (has) {
      const { error } = await supabase
        .from("post_reactions")
        .delete()
        .eq("post_id", id)
        .eq("user_id", meId)
        .eq("reaction", key);

      if (error) {
        setMyReactions((prev) => new Set(prev).add(key));
        setReactionCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
        console.error(error);
      }
    } else {
      const { error } = await supabase
        .from("post_reactions")
        .insert({ post_id: id, user_id: meId, reaction: key });

      if (error) {
        setMyReactions((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
        setReactionCounts((prev) => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
        console.error(error);
      }
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
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
            {/* POST */}
            <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{postUsername}</p>
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

            {/* REACTIONS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleReaction("support")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                      myReactions.has("support")
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                    Support{" "}
                    <span className="text-slate-400 font-extrabold">{reactionCounts.support}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleReaction("helpful")}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all flex items-center gap-2 ${
                      myReactions.has("helpful")
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
                      myReactions.has("relate")
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

            {/* COMMENTS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Comments
                </h2>
                <span className="text-xs font-bold text-slate-400">
                  {commentLoading ? "Loading..." : `${comments.length} total`}
                </span>
              </div>

              {/* Composer */}
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

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCommentAnon((v) => !v)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        commentAnon
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {commentAnon ? "Commenting anonymously" : "Click to comment anonymously"}
                    </button>

                    <button
                      type="button"
                      onClick={addComment}
                      disabled={!commentText.trim() || !meId}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      Post
                    </button>
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="mt-6 space-y-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{c.username}</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                          • {c.time}
                        </p>
                      </div>

                      {meId && c.authorId === meId ? (
                        <button
                          type="button"
                          onClick={() => deleteComment(c.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                          title="Delete comment"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      ) : null}
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