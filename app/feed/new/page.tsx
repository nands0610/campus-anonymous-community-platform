"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { ArrowLeft, Bold, Italic, List, ImageIcon, Tag, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function NewPostPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");

    const pastelColors = [
        "border-[#38bdf8] text-[#0369A1] bg-white border", // Blue
        "border-[#4ade80] text-[#15803D] bg-white border", // Green
        "border-[#f472b6] text-[#BE185D] bg-white border", // Pink
        "border-[#a78bfa] text-[#7E22CE] bg-white border", // Purple
        "border-[#fbbf24] text-[#A16207] bg-white border", // Yellow
        "border-[#fb923c] text-[#C2410C] bg-white border", // Orange
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

                    {/* Footer Actions */}
                    <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/feed" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-all px-4">Cancel</Link>
                            <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                Post
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </FeedLayout>
    );
}
