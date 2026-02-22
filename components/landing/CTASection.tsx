"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
    return (
        <section className="py-24 bg-[#fffaf5]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    className="bg-white rounded-3xl p-12 md:p-20 text-center border border-slate-200 soft-shadow overflow-hidden relative"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">
                            Experience the future of <br className="hidden md:block" />
                            campus communication today.
                        </h2>

                        <p className="text-lg text-slate-600 mb-10">
                            Join thousands of students who are already using Geddit to share experiences and build a better campus community.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/auth/signup"
                                className="btn-primary w-full sm:w-auto text-lg px-10"
                            >
                                Get started free Now
                            </Link>
                            <Link
                                href="/auth/login"
                                className="btn-secondary w-full sm:w-auto text-lg px-10"
                            >
                                Sign In
                            </Link>
                        </div>

                        <p className="mt-8 text-xs font-bold text-slate-400 uppercase">
                            Verified college email only
                        </p>
                    </div>

                    {/* Very subtle professional detail */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                </motion.div>
            </div>
        </section>
    );
}
