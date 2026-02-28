"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { motion } from "framer-motion";
import { User, Heart, MessageSquare, Share2, MoreHorizontal, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function PostDetailPage() {
    const post = {
        username: "@shadow_owl",
        time: "12 mins ago",
        title: "Is it worth dropping out of CSE for Design?",
        content: "I've been struggling with DSA and competitive coding for two years now. Every time I open Figma, I feel alive. Every time I open LeetCode, I want to vanish. Has anyone else made this switch? How did your parents react?\n\nI feel like I'm wasting my potential in CSE, but the job market for design in India seems so small compared to dev roles. I'm really confused.",
        type: "Advice" as const,
        tags: ["careers", "design", "stress"],
        reactions: 42,
        comments: [
            { id: 1, user: "@design_guru", time: "5 mins ago", text: "I made the switch in 3rd year. Best decision ever. Market is actually growing if you focus on UI/UX for fintech/SaaS." },
            { id: 2, user: "@tech_bro", time: "8 mins ago", text: "Don't drop out. Finish the degree for the resume, then do design. CSE degree helps everywhere." }
        ]
    };

    const pastelColors = [
        "border-[#38bdf8] text-[#0369A1] bg-white border", // Blue
        "border-[#4ade80] text-[#15803D] bg-white border", // Green
        "border-[#f472b6] text-[#BE185D] bg-white border", // Pink
        "border-[#a78bfa] text-[#7E22CE] bg-white border", // Purple
        "border-[#fbbf24] text-[#A16207] bg-white border", // Yellow
        "border-[#fb923c] text-[#C2410C] bg-white border", // Orange
    ];

    return (
        <FeedLayout>
            <div className="space-y-6">
                <Link href="/feed" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-all group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Feed
                </Link>

                <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-8 lg:p-12">
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-slate-900">{post.username}</p>
                                    <p className="text-xs font-semibold text-slate-400 mt-0.5 uppercase tracking-widest">{post.time} • Posted in {post.type}</p>
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        {/* Content with better readability */}
                        <div className="text-slate-700 font-medium text-lg leading-relaxed mb-10 whitespace-pre-wrap max-w-none">
                            {post.content}
                        </div>

                        {/* Tags Section */}
                        {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-10">
                                {post.tags.map((tag, index) => (
                                    <span
                                        key={tag}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${pastelColors[index % pastelColors.length]}`}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
                            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 transition-all">
                                <Heart className="w-5 h-5" />
                                {post.reactions}
                            </button>
                            <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-all">
                                <MessageSquare className="w-5 h-5" />
                                {post.comments.length}
                            </button>
                            <button className="ml-auto flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all">
                                <Share2 className="w-5 h-5" />
                                Share
                            </button>
                        </div>
                    </div>
                </article>

                {/* Responses Section */}
                <section className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 shadow-sm">
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Campus Geddits</h3>
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-full border border-slate-100">
                            {post.comments.length} RESPONSES
                        </span>
                    </div>

                    <div className="space-y-12">
                        {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-5 group">
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex-shrink-0 flex items-center justify-center text-slate-300 border border-slate-200 group-hover:bg-white transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-bold text-slate-900">{comment.user}</span>
                                        <span className="text-[11px] font-bold text-slate-300 uppercase">{comment.time}</span>
                                    </div>
                                    <p className="text-slate-600 text-[15px] leading-relaxed">
                                        {comment.text}
                                    </p>
                                    <div className="flex items-center gap-6 mt-4">
                                        <button className="text-[11px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Reply</button>
                                        <button className="text-[11px] font-black text-slate-400 hover:text-primary uppercase tracking-widest transition-colors">Helpful</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Response Input */}
                    <div className="mt-14 pt-10 border-t border-slate-100">
                        <div className="relative">
                            <textarea
                                placeholder="Post a helpful response..."
                                className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl text-[15px] font-medium outline-none focus:bg-white focus:border-primary/20 transition-all resize-none min-h-[160px] placeholder:text-slate-300"
                            />
                            <div className="flex justify-between items-center mt-6">
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    Gedding anonymously
                                </div>
                                <button className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Post response
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </FeedLayout>
    );
}
