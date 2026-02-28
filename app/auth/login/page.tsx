"use client";

import { motion } from "framer-motion";
import { Lock, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
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
                        src="/signin.png"
                        alt="Sign In"
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
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">G</div>
                        <span className="text-lg font-bold text-slate-900">Geddit</span>
                    </Link>
                </header>

                <div className="flex-1 flex items-center justify-center px-6 pb-20">
                    <div className="w-full max-w-[400px]">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-10 lg:text-left text-center"
                        >
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Login</h1>
                            <p className="text-slate-500 font-medium">Welcome back to the network.</p>
                        </motion.div>

                        <div className="space-y-6">
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsLoading(true); }}>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Username or Email</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. silent_warrior"
                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-slate-700">Password</label>
                                        <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 shadow-md shadow-primary/10"
                                >
                                    {isLoading ? "Authenticating..." : "Sign In"}
                                </button>
                            </form>

                            <p className="text-center text-sm font-medium text-slate-500">
                                New here? {" "}
                                <Link href="/auth/signup" className="text-primary font-bold hover:underline">Create an account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
