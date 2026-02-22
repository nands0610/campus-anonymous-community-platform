"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-32 bg-[#fffaf5] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >


                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                            The Pulse of <br />
                            <span className="text-primary italic">Your Campus.</span>
                        </h1>

                        <p className="max-w-xl text-xl text-slate-600 mb-10 leading-relaxed font-normal">
                            An anonymous space to ask advice, find collaborators, and share campus experiences without filters or judgment.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link
                                href="/auth/signup"
                                className="btn-primary w-full sm:w-auto text-center"
                            >
                                Join Geddit
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="btn-secondary w-full sm:w-auto text-center"
                            >
                                How it works
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <div className="relative w-full max-w-[1000px] aspect-square">
                            <Image
                                src="/hero_illustration.png"
                                alt="Anonymous Platform Interface"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
