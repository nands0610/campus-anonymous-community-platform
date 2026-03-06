"use client";

import Link from "next/link";
import { MessageSquare, Heart, Bookmark, MoreHorizontal, User, Flag, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type PostType = "Confession" | "Advice";

interface PostCardProps {
    id: string;   // 👈 REQUIRED
    username: string;
    time: string;
    title: string;
    content: string;
    type: PostType;
    tags: string[];
    reactions: number;
    comments: number;
    onSaveToggle?: () => void;
}

const FLAG_REASONS = [
    { value: "harassment", label: "Harassment or bullying" },
    { value: "hate", label: "Hate speech" },
    { value: "spam", label: "Spam" },
    { value: "doxxing", label: "Doxxing or privacy violation" },
    { value: "self_harm", label: "Self-harm or suicide" },
    { value: "other", label: "Other" },
];

export default function PostCard({
    id,
    username,
    time,
    title,
    content,
    type,
    tags,
    reactions,
    comments,
    onSaveToggle,
}: PostCardProps) {
    const supabase = createClient();
    const pastelColors = [
        "border-[#38bdf8] text-[#0369A1] bg-white",
        "border-[#4ade80] text-[#15803D] bg-white",
        "border-[#f472b6] text-[#BE185D] bg-white",
        "border-[#a78bfa] text-[#7E22CE] bg-white",
        "border-[#fbbf24] text-[#A16207] bg-white",
        "border-[#fb923c] text-[#C2410C] bg-white",
    ];

    const [flagModalOpen, setFlagModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [description, setDescription] = useState("");
    const [isFlagging, setIsFlagging] = useState(false);
    const [flagError, setFlagError] = useState<string | null>(null);
    const [flagSuccess, setFlagSuccess] = useState(false);
    const [isPostFlagged, setIsPostFlagged] = useState(false);
    const [isPostSaved, setIsPostSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveAction, setSaveAction] = useState<"save" | "unsave" | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function checkIfPostFlagged() {
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                if (!sessionData.session?.user?.id) {
                    return;
                }

                const { data, error } = await supabase
                    .from("reports")
                    .select("id")
                    .eq("post_id", id)
                    .eq("reporter_id", sessionData.session.user.id)
                    .single();

                if (!cancelled) {
                    if (data) {
                        setIsPostFlagged(true);
                    }
                }
            } catch (err) {
                // No report found or error occurred, that's ok
                if (!cancelled) {
                    setIsPostFlagged(false);
                }
            }
        }

        async function checkIfPostSaved() {
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                if (!sessionData.session?.user?.id) {
                    return;
                }

                const { data } = await supabase
                    .from("saved_posts")
                    .select("id")
                    .eq("post_id", id)
                    .eq("user_id", sessionData.session.user.id)
                    .single();

                if (!cancelled) {
                    if (data) {
                        setIsPostSaved(true);
                    }
                }
            } catch (err) {
                // No save found or error occurred, that's ok
                if (!cancelled) {
                    setIsPostSaved(false);
                }
            }
        }

        checkIfPostFlagged();
        checkIfPostSaved();

        return () => {
            cancelled = true;
        };
    }, [id, supabase]);

    async function handleFlag() {
        if (!selectedReason) {
            setFlagError("Please select a reason");
            return;
        }

        setIsFlagging(true);
        setFlagError(null);

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session?.access_token) {
                setFlagError("You must be logged in to flag a post");
                setIsFlagging(false);
                return;
            }

            const res = await fetch("/api/posts/flag", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({
                    postId: id,
                    reason: selectedReason,
                    details: description.trim() || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setFlagError(data.error || "Failed to flag post");
                setIsFlagging(false);
                return;
            }

            setFlagSuccess(true);
            setIsPostFlagged(true);
            setIsFlagging(false);
            setTimeout(() => {
                setFlagModalOpen(false);
                setFlagSuccess(false);
                setSelectedReason("");
                setDescription("");
            }, 1500);
        } catch (err: any) {
            setFlagError(err.message || "An error occurred");
            setIsFlagging(false);
        }
    }

    async function handleSaveToggle() {
        setIsSaving(true);
        const isUnsaving = isPostSaved;
        setSaveAction(isUnsaving ? "unsave" : "save");

        try {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session?.access_token) {
                alert("You must be logged in to save posts");
                setIsSaving(false);
                return;
            }

            const res = await fetch("/api/posts/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({
                    postId: id,
                    save: !isPostSaved,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsPostSaved(!isPostSaved);
                setSaveSuccess(true);
                if (onSaveToggle) {
                    onSaveToggle();
                }
                setTimeout(() => {
                    setSaveSuccess(false);
                    setSaveAction(null);
                }, 2000);
            } else {
                alert(data.error || "Failed to save post");
                setSaveAction(null);
            }
        } catch (err: any) {
            console.error("Failed to save post:", err);
            alert("Failed to save post: " + err.message);
            setSaveAction(null);
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <>
            <Link href={`/feed/${id}`} className="block">
                <div className="bg-white border border-slate-200 rounded-xl p-8 mb-4 hover:border-slate-300 transition-all group shadow-sm hover:shadow-md cursor-pointer">

                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-slate-900">
                                        {username}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        • {time}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="text-slate-300 hover:text-slate-900 transition-all"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors leading-tight">
                        {title}
                    </h3>

                    <p className="text-slate-600 text-[15px] leading-relaxed mb-6 line-clamp-3">
                        {content}
                    </p>

                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {tags.map((tag, index) => (
                                <span
                                    key={tag}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${pastelColors[index % pastelColors.length]}`}
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-all"
                            >
                                <Heart className="w-4 h-4" />
                                {reactions}
                            </button>
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-all"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {comments}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!isPostFlagged) {
                                        setFlagModalOpen(true);
                                    }
                                }}
                                disabled={isPostFlagged}
                                className={`text-xs font-semibold flex items-center gap-1.5 transition-all ${isPostFlagged
                                        ? "text-slate-300 cursor-not-allowed"
                                        : "text-slate-400 hover:text-amber-600 cursor-pointer"
                                    }`}
                            >
                                <Flag className="w-4 h-4" />
                                {isPostFlagged ? "Flagged" : "Flag"}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSaveToggle();
                                }}
                                disabled={isSaving}
                                className={`text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    isPostSaved
                                        ? "text-primary"
                                        : "text-slate-400 hover:text-primary"
                                } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                <Bookmark className={`w-4 h-4 ${isPostSaved ? "fill-current" : ""}`} />
                                {isPostSaved ? "Saved" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Save Success Toast */}
            {saveSuccess && (
                <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-green-500 text-white rounded-lg px-4 py-3 shadow-lg flex items-center gap-2">
                        <Bookmark className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">
                            {saveAction === "unsave" ? "Post unsaved!" : "Post saved!"}
                        </span>
                    </div>
                </div>
            )}

            {/* Flag Modal */}
            {flagModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    {/* Backdrop */}
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        onClick={() => {
                            setFlagModalOpen(false);
                            setFlagError(null);
                            setDescription("");
                        }}
                        aria-label="Close flag modal"
                    />

                    {/* Modal */}
                    <div className="relative w-[92vw] max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Report Post</h3>

                        {flagSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                    <AlertCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <p className="text-sm font-semibold text-green-700">Thank you for reporting</p>
                                <p className="text-xs text-slate-500 mt-2">We'll review this post shortly</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6">
                                    {FLAG_REASONS.map((reason) => (
                                        <button
                                            key={reason.value}
                                            onClick={() => {
                                                setSelectedReason(reason.value);
                                                setFlagError(null);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${selectedReason === reason.value
                                                    ? "border-primary bg-blue-50"
                                                    : "border-slate-200 hover:border-slate-300 bg-white"
                                                }`}
                                        >
                                            <p className={`text-sm font-semibold ${selectedReason === reason.value ? "text-primary" : "text-slate-700"
                                                }`}>
                                                {reason.label}
                                            </p>
                                        </button>
                                    ))}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Details (optional)</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Please provide any additional context that would help us review this report..."
                                        maxLength={200}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:bg-white focus:border-primary/20 transition-all resize-none h-20"
                                    />
                                    <p className="text-xs text-slate-400 mt-1">{description.length}/200</p>
                                </div>

                                {flagError && (
                                    <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-xs font-semibold text-red-600">{flagError}</p>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFlagModalOpen(false);
                                            setFlagError(null);
                                            setDescription("");
                                        }}
                                        className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleFlag}
                                        disabled={isFlagging}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isFlagging && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isFlagging ? "Reporting..." : "Report"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}