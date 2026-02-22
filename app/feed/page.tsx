"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import PostCard from "@/components/feed/PostCard";
import { motion } from "framer-motion";

export default function FeedPage() {
    const posts = [
        {
            username: "@shadow_owl",
            time: "12 mins ago",
            title: "Is it worth dropping out of CSE for Design?",
            content: "I've been struggling with DSA for two years. Every time I open Figma I feel alive. Has anyone else made this switch? How did your parents react?",
            type: "Advice" as const,
            tags: ["careers", "design", "stress"],
            reactions: 42,
            comments: 12,
        },
        {
            username: "@silent_warrior",
            time: "1 hour ago",
            title: "Mess food is actually getting better?",
            content: "Wait, am I the only one who thinks the new menu is actually edible? The chicken curry today was 10/10.",
            type: "Confession" as const,
            tags: ["mess", "food", "hot-take"],
            reactions: 156,
            comments: 84,
        },
        {
            username: "@code_wizard",
            time: "3 hours ago",
            title: "Looking for a co-founder for a Web3 project",
            content: "Building something big in the DeSci space. Need a backend dev who knows Rust/Solidity. Anyone interested?",
            type: "Question" as const,
            tags: ["startup", "web3", "collab"],
            reactions: 28,
            comments: 6,
        },
    ];

    return (
        <FeedLayout>
            <div className="space-y-6">
                {/* Post List */}
                <div className="space-y-4">
                    {posts.map((post, index) => (
                        <PostCard key={index} {...post} />
                    ))}
                </div>

                {/* Load More */}
                <div className="text-center py-12">
                    <button className="text-sm font-bold text-slate-400 hover:text-primary transition-all">
                        Show older posts
                    </button>
                </div>
            </div>
        </FeedLayout>
    );
}
