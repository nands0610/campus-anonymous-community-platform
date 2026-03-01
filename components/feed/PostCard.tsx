"use client";

import Link from "next/link";
import { MessageSquare, Heart, Share2, MoreHorizontal, User } from "lucide-react";

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
}

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
}: PostCardProps) {
    const pastelColors = [
        "border-[#38bdf8] text-[#0369A1] bg-white",
        "border-[#4ade80] text-[#15803D] bg-white",
        "border-[#f472b6] text-[#BE185D] bg-white",
        "border-[#a78bfa] text-[#7E22CE] bg-white",
        "border-[#fbbf24] text-[#A16207] bg-white",
        "border-[#fb923c] text-[#C2410C] bg-white",
    ];

    return (
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
            <button
                onClick={(e) => e.preventDefault()}
                className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1.5"
            >
                <Share2 className="w-4 h-4" />
                Share
            </button>
            </div>
        </div>
        </Link>
    );
}