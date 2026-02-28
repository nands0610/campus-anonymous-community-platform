"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff } from "lucide-react";
import Image from "next/image";

export default function PrivacySection() {
    return (
        <section id="about" className="py-24 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -15 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="order-2 lg:order-1"
                    >

                        <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                            Privacy that works for <span className="text-primary italic">you.</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            We believe in the power of honest conversation. Geddit uses advanced alias rotation and secured campus-restricted authentication to ensure you can speak your mind without identifying yourself.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                                    <EyeOff className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-900">Redacted Identity</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">Your identity is protected by campus-restricted auth layers.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-900">End-to-End Privacy</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">Messages and posts are untraceable back to your institutional ID.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative order-1 lg:order-2 flex justify-center"
                    >
                        <div className="relative w-full max-w-[1000px] aspect-square rounded-2xl overflow-hidden">
                            <Image
                                src="/privacy.png"
                                alt="Privacy Features"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
