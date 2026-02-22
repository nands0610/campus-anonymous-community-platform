"use client";

import { motion } from "framer-motion";
import { Mail, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left side Branding - Split Screen Layout */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-50 border-r border-slate-100 flex-col items-center justify-center p-12">
                <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 group z-20">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                        <ChevronLeft className="w-6 h-6" />
                    </div>
                    <span className="text-slate-900 font-bold">Back Home</span>
                </Link>

                {/* Smaller, transparent image without box */}
                <div className="relative w-full max-w-[500px] aspect-square">
                    <Image
                        src="/signup.png"
                        alt="Pulse Sign Up"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

            </div>

            {/* Right side form */}
            <div className="flex-1 flex flex-col">
                <header className="p-10 flex justify-end items-center lg:hidden">
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">P</div>
                        <span className="text-lg font-bold text-slate-900">Pulse</span>
                    </Link>
                </header>

                <div className="flex-1 flex items-center justify-center px-6 pb-20">
                    <div className="w-full max-w-[440px]">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {step === 1 ? (
                                <>
                                    <div className="mb-10 lg:text-left text-center">
                                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
                                        <p className="text-slate-500 font-medium">Join your campus network.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-bold text-slate-700">Campus Email</label>
                                                <input
                                                    type="email"
                                                    placeholder="yourname@college.edu"
                                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-bold text-slate-700">Alias</label>
                                                    <input
                                                        type="text"
                                                        placeholder="shadow_owl"
                                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-sm font-bold text-slate-700">Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-md shadow-primary/10 mt-6"
                                            >
                                                Get Started
                                            </button>
                                        </form>

                                        <p className="text-center text-sm font-medium text-slate-500">
                                            Already have an account? {" "}
                                            <Link href="/auth/login" className="text-primary font-bold hover:underline">Log in</Link>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-primary mx-auto mb-8">
                                        <Mail className="w-7 h-7" />
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Check Your Inbox</h1>
                                    <p className="max-w-xs mx-auto text-slate-500 font-medium mb-12">
                                        We've sent a verification link to your campus email.
                                    </p>

                                    <div className="space-y-6">
                                        <button
                                            onClick={() => { setIsLoading(true); setTimeout(() => window.location.href = '/feed', 1000); }}
                                            disabled={isLoading}
                                            className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-md shadow-primary/10"
                                        >
                                            {isLoading ? "Validating..." : "Verify email"}
                                            {!isLoading && <CheckCircle2 className="w-5 h-5" />}
                                        </button>
                                        <button className="text-sm font-bold text-primary hover:underline">Resend verification link</button>
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
