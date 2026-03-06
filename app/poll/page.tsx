"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { motion } from "framer-motion";
import { Users, CheckCircle, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function PollPage() {
    const [poll, setPoll] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [selected, setSelected] = useState<string | null>(null);
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(true);

    async function loadPoll() {
        setLoading(true);
        setSelected(null);
        setVoted(false);

        const { data: pollData, error } = await supabase
            .from("posts")
            .select(`
        id,
        title,
        poll_options (
          id,
          option_text,
          poll_votes (
            user_id
          )
        )
      `)
            .eq("type", "poll")
            .eq("status", "published")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Poll load error:", error);
            setLoading(false);
            return;
        }

        if (!pollData) {
            setLoading(false);
            return;
        }

        pollData.poll_options = pollData.poll_options.map((o: any) => ({
            ...o,
            poll_votes: o.poll_votes || [],
        }));

        setPoll({ ...pollData });

        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;

        if (userId) {
            for (const option of pollData.poll_options) {
                if (option.poll_votes.some((v: any) => v.user_id === userId)) {
                    setSelected(option.id);
                    setVoted(true);
                    break;
                }
            }
        }

        setLoading(false);
    }

    const addOption = () => {
        setOptions([...options, ""]);
    };

    const updateOption = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const publishPoll = async () => {
        if (!question.trim()) return;

        const validOptions = options.filter((o) => o.trim() !== "");
        if (validOptions.length < 2) {
            alert("Poll needs at least 2 options");
            return;
        }

        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user) return;

        const { data: post, error: postError } = await supabase
            .from("posts")
            .insert({
                title: question,
                body: "poll",
                type: "poll",
                status: "published",
                author_id: userData.user.id,
            })
            .select()
            .single();

        if (postError) {
            console.error("POST ERROR:", JSON.stringify(postError, null, 2));
            alert("Error creating poll: " + postError.message);
            return;
        }

        const optionsToInsert = validOptions.map((o) => ({
            post_id: post.id,
            option_text: o,
        }));

        const { error: optionsError } = await supabase
            .from("poll_options")
            .insert(optionsToInsert);

        if (optionsError) {
            console.error(optionsError);
            return;
        }

        setShowModal(false);
        setQuestion("");
        setOptions(["", ""]);

        await loadPoll();
    };

    useEffect(() => {
        loadPoll();
    }, []);

    const handleVote = async (optionId: string) => {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) return;

        const { error } = await supabase.from("poll_votes").insert({
            option_id: optionId,
            user_id: user.id,
            post_id: poll.id
        });

        if (error) {
            if (error.code === "23505") {
                setVoted(true);
                return;
            }

            alert(JSON.stringify(error, null, 2));
            console.error("Vote error:", error);
            return;
        }

        setSelected(optionId);
        setVoted(true);

        await loadPoll();
    };

    if (loading || !poll) {
        return (
            <FeedLayout>
                <div className="p-10 text-center text-slate-400 font-semibold">
                    Loading poll...
                </div>
            </FeedLayout>
        );
    }

    const totalVotes =
        poll.poll_options?.reduce(
            (sum: number, option: any) => sum + option.poll_votes.length,
            0
        ) || 0;

    return (
        <FeedLayout>
            <div className="space-y-8">

                {/* HEADER */}
                <header className="pb-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">
                            Weekly Poll
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Your voice matters. Vote anonymously with your campus peers.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
                    >
                        + Add Poll
                    </button>
                </header>

                {/* POLL CARD */}
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-6">
                        <Timer className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            Closes in 48 hours
                        </span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-10 leading-snug">
                        {poll.title}
                    </h2>

                    <div className="space-y-3">
                        {poll.poll_options.map((option: any) => {
                            const votes = option.poll_votes.length;

                            const percentage =
                                totalVotes > 0
                                    ? Math.round((votes / totalVotes) * 100)
                                    : 0;

                            return (
                                <button
                                    key={option.id}
                                    onClick={() => !voted && handleVote(option.id)}
                                    disabled={voted}
                                    className={`w-full relative p-5 rounded-lg border transition-all flex items-center justify-between ${voted
                                        ? selected === option.id
                                            ? "border-primary bg-blue-50/30"
                                            : "border-slate-100 bg-slate-50/50 cursor-default"
                                        : "border-slate-200 bg-white hover:border-primary/40"
                                        }`}
                                >
                                    {voted && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            className="absolute inset-y-0 left-0 bg-primary/5 -z-0"
                                        />
                                    )}

                                    <span
                                        className={`relative z-10 text-base font-bold ${voted && selected === option.id
                                            ? "text-primary"
                                            : "text-slate-700"
                                            }`}
                                    >
                                        {option.option_text}
                                    </span>

                                    {voted && (
                                        <div className="relative z-10 flex items-center gap-3">
                                            <span className="text-sm font-bold text-primary">
                                                {percentage}%
                                            </span>

                                            {selected === option.id && (
                                                <CheckCircle className="w-4 h-4 text-primary fill-current" />
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{totalVotes} students have voted</span>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 w-[500px] space-y-6">

                        <h2 className="text-xl font-bold">Create Poll</h2>

                        <input
                            type="text"
                            placeholder="Enter poll question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full border rounded-lg p-3"
                        />

                        <div className="space-y-3">
                            {options.map((opt, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => updateOption(i, e.target.value)}
                                    className="w-full border rounded-lg p-3"
                                />
                            ))}
                        </div>

                        <button
                            onClick={addOption}
                            className="text-primary text-sm font-semibold"
                        >
                            + Add Option
                        </button>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={publishPoll}
                                className="bg-primary text-white px-4 py-2 rounded-lg"
                            >
                                Publish
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </FeedLayout>
    );
}