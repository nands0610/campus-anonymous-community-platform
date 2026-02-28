"use client";

import { motion } from "framer-motion";
import { Mail, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const supabase = createClient();

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const [err, setErr] = useState<string | null>(null);

    const [email, setEmail] = useState("");
    const [alias, setAlias] = useState("");
    const [password, setPassword] = useState("");

    async function checkAliasAvailable(a: string) {
  const res = await fetch("/api/auth/check-alias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ alias: a }),
  });

  if (!res.ok) return false; // treat as unavailable if server error
  const data = (await res.json()) as { available?: boolean };
  return Boolean(data.available);
}

async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setErr(null);
    setMsg(null);

    const cleanedAlias = alias.trim();

    // quick local validation (UX)
    if (cleanedAlias.length < 3) {
        setErr("Username must be at least 3 characters.");
        setIsLoading(false);
        return;
    }

    // 1) Check alias uniqueness
    const available = await checkAliasAvailable(cleanedAlias);
    if (!available) {
        setErr("Username already taken. Try another.");
        setIsLoading(false);
        return;
    }

    const origin = typeof window !== "undefined" ? window.location.origin : "";

    // 2) Signup
    const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: { alias: cleanedAlias },
        },
    });

    setIsLoading(false);

    if (error) {
        // If the DB unique constraint still catches a race condition:
        const msg = error.message.toLowerCase();
        if (msg.includes("duplicate") || msg.includes("unique")) {
        setErr("Username already taken. Try another.");
        } else {
        setErr(error.message);
        }
        return;
    }

    setStep(2);
    setMsg("Verification link sent. Check your inbox.");
    }

    async function resend() {
        setIsLoading(true);
        setErr(null);
        setMsg(null);

        const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        });

        setIsLoading(false);
        if (error) setErr(error.message);
        else setMsg("Verification link resent.");
    }

    return (
        <div className="min-h-screen flex bg-white font-sans">
        {/* Left */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-50 border-r border-slate-100 flex-col items-center justify-center p-12">
            <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 group z-20">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                <ChevronLeft className="w-6 h-6" />
            </div>
            <span className="text-slate-900 font-bold">Back Home</span>
            </Link>

            <div className="relative w-full max-w-[500px] aspect-square">
            <Image src="/signup.png" alt="Sign Up" fill className="object-contain" priority />
            </div>
        </div>

        {/* Right */}
        <div className="flex-1 flex flex-col">
            <header className="p-10 flex justify-end items-center lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">G</div>
                <span className="text-lg font-bold text-slate-900">Geddit</span>
            </Link>
            </header>

            <div className="flex-1 flex items-center justify-center px-6 pb-20">
            <div className="w-full max-w-[440px]">
                <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {step === 1 ? (
                    <>
                    <div className="mb-10 lg:text-left text-center">
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500 font-medium">Join your campus network.</p>
                    </div>

                    <div className="space-y-6">
                        <form className="space-y-5" onSubmit={onSignup}>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Campus Email</label>
                            <input
                            type="email"
                            placeholder="yourname@college.edu"
                            className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg ..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Alias</label>
                            <input
                                type="text"
                                placeholder="shadow_owl"
                                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg ..."
                                value={alias}
                                onChange={(e) => setAlias(e.target.value)}
                                required
                            />
                            </div>
                            <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-700">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg ..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            </div>
                        </div>

                        {err ? <p className="text-sm font-bold text-red-600">{err}</p> : null}
                        {msg ? <p className="text-sm font-bold text-green-700">{msg}</p> : null}

                        <button type="submit" disabled={isLoading} className="w-full py-4 bg-primary text-white font-bold rounded-lg ... mt-6">
                            {isLoading ? "Creating..." : "Get Started"}
                        </button>
                        </form>

                        <p className="text-center text-sm font-medium text-slate-500">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-primary font-bold hover:underline">
                            Log in
                        </Link>
                        </p>
                    </div>
                    </>
                ) : (
                    <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
                        <Mail className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Check Your Inbox</h1>
                    <p className="max-w-xs mx-auto text-slate-500 font-medium mb-6">
                        We’ve sent a verification link to {email}.
                    </p>

                    {err ? <p className="text-sm font-bold text-red-600 mb-4">{err}</p> : null}
                    {msg ? <p className="text-sm font-bold text-green-700 mb-4">{msg}</p> : null}

                    <div className="space-y-6">
                        <Link
                        href="/auth/login"
                        className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-md shadow-primary/10"
                        >
                        Go to login <CheckCircle2 className="w-5 h-5" />
                        </Link>

                        <button onClick={resend} disabled={isLoading} className="text-sm font-bold text-primary hover:underline">
                        {isLoading ? "Resending..." : "Resend verification link"}
                        </button>
                    </div>
                    </div>
                )}
                </motion.div>
            </div>
            </div>
        </div>
        </div>
    );
}