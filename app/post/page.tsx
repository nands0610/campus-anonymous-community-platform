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

    return (
        <FeedLayout>
            <div className="space-y-6">
                <Link href="/feed" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-all group">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Feed
                </Link>

                <article className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900 leading-none">{post.username}</p>
                                    <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-tighter">{post.time} in {post.type}</p>
                                </div>
                            </div>
                            <button className="text-slate-300 hover:text-slate-900 transition-all">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="text-slate-600 font-medium text-[16px] leading-relaxed mb-8 whitespace-pre-wrap">
                            {post.content}
                        </div>

                        <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-all">
                                <Heart className="w-4 h-4" />
                                {post.reactions}
                            </button>
                            <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-all">
                                <MessageSquare className="w-4 h-4" />
                                {post.comments.length}
                            </button>
                            <button className="ml-auto text-xs font-bold text-slate-400 hover:text-slate-900 transition-all flex items-center gap-1.5">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>
                    </div>
                </article>

                {/* Responses Section */}
                <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-10">Campus Responses</h3>

                    <div className="space-y-10">
                        {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-50 flex-shrink-0 flex items-center justify-center text-slate-300 border border-slate-100">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-slate-900">{comment.user}</span>
                                        <span className="text-[11px] font-medium text-slate-400">{comment.time}</span>
                                    </div>
                                    <p className="text-slate-600 text-[14px] leading-relaxed">
                                        {comment.text}
                                    </p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <button className="text-[11px] font-bold text-slate-400 hover:text-primary uppercase transition-colors">Reply</button>
                                        <button className="text-[11px] font-bold text-slate-400 hover:text-primary uppercase transition-colors">Helpful</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Simple Response Input */}
                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <div className="relative">
                            <textarea
                                placeholder="Post a helpful response..."
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:bg-white focus:border-primary/20 transition-all resize-none min-h-[120px] placeholder:text-slate-400"
                            />
                            <div className="flex justify-between items-center mt-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Posting anonymously</p>
                                <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2">
                                    <Send className="w-3.5 h-3.5" />
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </FeedLayout>
    );
}
