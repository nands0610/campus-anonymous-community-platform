"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { motion } from "framer-motion";
import { TrendingUp, MessageCircle, Heart, ArrowUpLeft } from "lucide-react";

export default function TrendingPage() {
    const trendingTopics = [
        { rank: 1, topic: "Placements 2026", posts: 1540, comments: 12000, reactions: 1300, change: "+15%" },
        { rank: 2, topic: "Hackathon Week", posts: 890, comments: 5600, reactions: 900, change: "+8%" },
        { rank: 3, topic: "Mess Food Rant", posts: 750, comments: 4200, reactions: 650, change: "+12%" },
        { rank: 4, topic: "Library Floor 3", posts: 620, comments: 3100, reactions: 420, change: "-2%" },
        { rank: 5, topic: "Finals Stress", posts: 580, comments: 2800, reactions: 390, change: "+5%" },
    ];

    return (
        <FeedLayout>
            <div className="space-y-8">
                <header className="pb-6 border-b border-slate-100">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Hot Trending</h1>
                    <p className="text-slate-500 font-medium">What's the campus talking about right now?</p>
                </header>

                <div className="space-y-3">
                    {trendingTopics.map((item) => (
                        <div
                            key={item.rank}
                            className="bg-white p-6 rounded-xl border border-slate-200 flex items-center gap-6 group hover:border-primary/40 transition-all cursor-pointer shadow-sm"
                        >
                            <div className="flex items-center justify-center w-12 h-12 bg-slate-50 rounded-lg border border-slate-100 font-bold text-slate-900 group-hover:text-primary transition-colors">
                                {item.rank}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors tracking-tight">
                                    #{item.topic}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-xs font-semibold text-slate-400">
                                    <span>{item.posts} Posts</span>
                                    <span>{item.comments} Comments</span>
                                    <span className={item.change.startsWith('+') ? 'text-green-600' : 'text-red-500'}>{item.change} velocity</span>
                                </div>
                            </div>

                            <div className="text-slate-300 group-hover:text-primary transition-colors">
                                <ArrowUpLeft className="rotate-45 w-5 h-5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </FeedLayout>
    );
}
