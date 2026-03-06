"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { ArrowLeft, Tag, Send } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewPostPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(true);

    const searchParams = useSearchParams();
    const draftId = searchParams.get("draft");

    const supabase = createClient();
    const router = useRouter();

    const [postType, setPostType] = useState<"confession" | "advice">("confession");
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isDraftSaving, setIsDraftSaving] = useState(false);
    const [draftError, setDraftError] = useState<string | null>(null);

    const pastelColors = [
        "border-[#38bdf8] text-[#0369A1] bg-white border",
        "border-[#4ade80] text-[#15803D] bg-white border",
        "border-[#f472b6] text-[#BE185D] bg-white border",
        "border-[#a78bfa] text-[#7E22CE] bg-white border",
        "border-[#fbbf24] text-[#A16207] bg-white border",
        "border-[#fb923c] text-[#C2410C] bg-white border",
    ];

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && currentTag.trim()) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    /* ---------------- LOAD DRAFT ---------------- */

    useEffect(() => {
        if (!draftId) return;

        async function loadDraft() {
            const { data, error } = await supabase
                .from("posts")
                .select("*")
                .eq("id", draftId)
                .single();

            if (error) {
                console.error("Draft load error:", error);
                return;
            }

            if (data) {
                setTitle(data.title || "");
                setContent(data.body || "");
                setTags(data.user_tags || []);
                setPostType(data.type);
                setIsAnonymous(data.is_anonymous);
            }
        }

        loadDraft();
    }, [draftId]);

    function handleCancelClick() {
        const hasContent =
            title.trim() ||
            content.trim() ||
            tags.length > 0 ||
            currentTag.trim();

        if (!hasContent) {
            router.push("/feed");
            return;
        }

        setDraftError(null);
        setShowCancelModal(true);
    }

async function handleDelete() {
    setShowCancelModal(false);

    if (draftId) {
        await supabase
            .from("posts")
            .delete()
            .eq("id", draftId);
    }

    router.push("/feed");
}

    /* ---------------- SAVE DRAFT ---------------- */

    async function handleSaveDraft() {
        setIsDraftSaving(true);
        setDraftError(null);

        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes.user;

        if (!user) {
            setDraftError("You must be logged in.");
            setIsDraftSaving(false);
            return;
        }

        let error;

        if (draftId) {
            ({ error } = await supabase
                .from("posts")
                .update({
                    title: title.trim() || null,
                    body: content.trim() || "",
                    user_tags: tags,
                    type: postType,
                    is_anonymous: isAnonymous,
                })
                .eq("id", draftId));
        } else {
            ({ error } = await supabase.from("posts").insert({
                author_id: user.id,
                status: "draft",
                title: title.trim() || null,
                body: content.trim() || "",
                user_tags: tags,
                type: postType,
                is_anonymous: isAnonymous,
            }));
        }

        setIsDraftSaving(false);

        if (error) {
            setDraftError(error.message);
            return;
        }

        setShowCancelModal(false);
        router.push("/feed");
        router.refresh();
    }

    /* ---------------- POST ---------------- */

    async function handlePost() {
        setIsSaving(true);
        setSaveError(null);

        if (!content.trim()) {
            setSaveError("Post content cannot be empty.");
            setIsSaving(false);
            return;
        }

        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes.user;

        if (!user) {
            setSaveError("You must be logged in.");
            setIsSaving(false);
            return;
        }

        let error;

        if (draftId) {
            ({ error } = await supabase
                .from("posts")
                .update({
                    status: "published",
                    title: title.trim() || null,
                    body: content.trim(),
                    user_tags: tags,
                    type: postType,
                    is_anonymous: isAnonymous,
                    published_at: new Date().toISOString(),
                })
                .eq("id", draftId));
        } else {
            ({ error } = await supabase.from("posts").insert({
                author_id: user.id,
                status: "published",
                title: title.trim() || null,
                body: content.trim(),
                user_tags: tags,
                type: postType,
                is_anonymous: isAnonymous,
                published_at: new Date().toISOString(),
            }));
        }

        setIsSaving(false);

        if (error) {
            setSaveError(error.message);
            return;
        }

        router.push("/feed");
        router.refresh();
    }

    return (
        <FeedLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/feed"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Feed
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900 mt-4">Create New Post</h1>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

                    <div className="p-8 space-y-8">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Post Type</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPostType("confession")}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${postType === "confession"
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Confession
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPostType("advice")}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${postType === "advice"
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Advice
                                </button>
                            </div>
                        </div>

                        {/* Anonymous Toggle */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">
                                Visibility
                            </label>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAnonymous(true)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${isAnonymous
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Post Anonymously
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsAnonymous(false)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${!isAnonymous
                                            ? "bg-primary text-white border-primary"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    Show My Alias
                                </button>
                            </div>
                        </div>
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                            <input
                                type="text"
                                placeholder="What's on your mind?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-2xl font-bold text-slate-900 placeholder:text-slate-200 outline-none border-b border-transparent focus:border-slate-100 pb-2 transition-all"
                            />
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                <Tag className="w-3 h-3" />
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag, index) => (
                                    <span
                                        key={tag}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${pastelColors[index % pastelColors.length]}`}
                                    >
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:opacity-70">×</button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                placeholder="Add tags (press Enter)"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="w-full text-sm font-medium text-slate-600 placeholder:text-slate-300 outline-none bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 focus:border-primary/20 transition-all"
                            />
                        </div>

                        {/* Content Editor */}
                        <div className="space-y-4">
                            <textarea
                                placeholder="Share your thoughts anonymously..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[300px] text-slate-700 font-medium leading-relaxed outline-none resize-none placeholder:text-slate-200"
                            />
                        </div>
                    </div>

                    {saveError ? (
                        <p className="text-sm font-bold text-red-600">{saveError}</p>
                    ) : null}

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleCancelClick}
                                className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-all px-4"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handlePost}
                                disabled={isSaving}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-60"
                            >
                                {isSaving ? "Posting..." : "Post"}
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowCancelModal(false)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-slate-900">
                            Save as draft?
                        </h3>
                        <p className="text-sm text-slate-500 mt-2">
                            You have unsaved changes. Do you want to save this post as a draft?
                        </p>

                        {draftError && (
                            <p className="text-sm font-bold text-red-600 mt-3">
                                {draftError}
                            </p>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50"
                            >
                                Delete
                            </button>

                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={isDraftSaving}
                                className="px-4 py-2 rounded-lg font-bold text-sm bg-primary text-white hover:bg-blue-700 disabled:opacity-60"
                            >
                                {isDraftSaving ? "Saving..." : "Save as Draft"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </FeedLayout>
    );
}
