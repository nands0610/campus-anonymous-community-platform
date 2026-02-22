"use client";

import { MessageSquare, Heart, Share2, MoreHorizontal, User } from "lucide-react";
import { motion } from "framer-motion";

export type PostType = "Confession" | "Question" | "Advice" | "Poll";

interface PostCardProps {
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
    username,
    time,
    title,
    content,
    type,
    tags,
    reactions,
    comments,
}: PostCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8 mb-4 hover:border-slate-300 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <User className="w-4 h-4" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{username}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">• {time}</span>
                        </div>
                    </div>
                </div>
                <button className="text-slate-300 hover:text-slate-900 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors cursor-pointer leading-tight">
                {title}
            </h3>

            <p className="text-slate-600 text-[15px] leading-relaxed mb-6 line-clamp-2">
                {content}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-all">
                        <Heart className="w-4 h-4" />
                        {reactions}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-all">
                        <MessageSquare className="w-4 h-4" />
                        {comments}
                    </button>
                </div>
                <button className="text-xs font-semibold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>
        </div>
    );
}
