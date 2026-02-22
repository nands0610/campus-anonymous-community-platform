"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { motion } from "framer-motion";
import { Users, CheckCircle, Timer } from "lucide-react";
import { useState } from "react";

export default function PollPage() {
    const [voted, setVoted] = useState(false);
    const [selected, setSelected] = useState<number | null>(null);

    const pollData = {
        question: "Sai Abhyankar vs Anirudh",
        totalVotes: 842,
        options: [
            { id: 1, label: "Anirudh", percentage: 75 },
            { id: 2, label: "Sai Abhyankar", percentage: 25 },
        ]
    };

    const handleVote = (id: number) => {
        setSelected(id);
        setVoted(true);
    };

    return (
        <FeedLayout>
            <div className="space-y-8">
                <header className="pb-6 border-b border-slate-100">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Weekly Poll</h1>
                    <p className="text-slate-500 font-medium">Your voice matters. Vote anonymously with your campus peers.</p>
                </header>

                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Timer className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Closes in 48 hours</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-snug">
                        {pollData.question}
                    </h2>

                    <div className="space-y-3">
                        {pollData.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => !voted && handleVote(option.id)}
                                disabled={voted}
                                className={`w-full relative p-5 rounded-lg border transition-all flex items-center justify-between group ${voted
                                        ? selected === option.id
                                            ? 'border-primary bg-blue-50/30'
                                            : 'border-slate-100 bg-slate-50/50 cursor-default'
                                        : 'border-slate-200 bg-white hover:border-primary/40'
                                    }`}
                            >
                                {/* Progress bar overlay */}
                                {voted && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${option.percentage}%` }}
                                        className="absolute inset-y-0 left-0 bg-primary/5 -z-0"
                                    />
                                )}

                                <span className={`relative z-10 text-base font-bold transition-colors ${voted && selected === option.id ? 'text-primary' : 'text-slate-700'}`}>
                                    {option.label}
                                </span>

                                {voted && (
                                    <div className="relative z-10 flex items-center gap-3">
                                        <span className="text-sm font-bold text-primary">{option.percentage}%</span>
                                        {selected === option.id && <CheckCircle className="w-4 h-4 text-primary fill-current" />}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{pollData.totalVotes} students have voted</span>
                    </div>
                </div>
            </div>
        </FeedLayout>
    );
}
