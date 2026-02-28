"use client";

import { Home, TrendingUp, BarChart2, Search, Bell, User, Plus, Filter, MessageSquare, Heart, Share2, MoreHorizontal, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Feed", href: "/feed" },
        { icon: TrendingUp, label: "Trending", href: "/trending" },
        { icon: BarChart2, label: "Weekly Poll", href: "/poll" },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Top Navbar - Clean & High Fidelity */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200/60 h-16">
                <div className="max-w-[1280px] mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-10">
                        <Link href="/feed" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">G</div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">Geddit</span>
                        </Link>

                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center relative">
                            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search campus posts..."
                                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent border focus:bg-white focus:border-primary/20 rounded-md text-sm font-medium outline-none transition-all w-64"
                            />
                        </div>
                        <button className="text-slate-500 hover:text-primary transition-all relative">
                            <Bell className="w-5 h-5" />
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                        <Link href="#" className="flex items-center gap-3 py-1 text-slate-700 hover:text-primary transition-all">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold hidden sm:block">@silent_owl</span>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-[1280px] mx-auto pt-24 px-6 flex gap-10">
                {/* Left Sidebar - Minimalist */}
                <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-24 h-fit">
                    <div className="space-y-6">
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-all ${pathname === item.href
                                        ? 'bg-blue-50 text-primary'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Your Space</h4>
                            <div className="space-y-1 text-sm font-medium text-slate-600 px-3">
                                <p className="hover:text-primary cursor-pointer transition-colors py-1.5">Saved Posts</p>
                                <p className="hover:text-primary cursor-pointer transition-colors py-1.5">Your Interactions</p>
                                <p className="hover:text-primary cursor-pointer transition-colors py-1.5">Moderation Hub</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Feed Content - Spaced for reading */}
                <main className="flex-1 max-w-2xl pb-24">
                    {/* Community Sub-Header Bar (Wireframe 3) */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">

                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                            <Link
                                href="/feed/new"
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-sm shadow-primary/10"
                            >
                                <Plus className="w-4 h-4" />
                                Add new
                            </Link>
                        </div>
                    </div>

                    {children}
                </main>

                {/* Right Sidebar - High Fidelity Info */}
                <aside className="hidden xl:block w-72 space-y-8 sticky top-24 h-fit">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Trending Buzz</h3>
                        <div className="space-y-5">
                            {[
                                { tag: "#Placements2026", posts: 124 },
                                { tag: "#HackathonWeek", posts: 89 },
                                { tag: "#MessFoodRant", posts: 56 },
                                { tag: "#FinalsStress", posts: 42 }
                            ].map((topic) => (
                                <div key={topic.tag} className="group cursor-pointer">
                                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{topic.tag}</p>
                                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">{topic.posts} posts this week</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">Engagement</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4">Geddit is growing! Join the conversation and help build a better campus.</p>
                        <button className="w-full py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-md hover:bg-slate-50 transition-all">Invite Peers</button>
                    </div>
                </aside>
            </div>

            {/* Mobile Bottom Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around items-center h-16 px-6">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 ${pathname === item.href ? 'text-primary' : 'text-slate-400'}`}>
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase">{item.label}</span>
                    </Link>
                ))}
                <button className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <Plus className="w-5 h-5" />
                </button>
            </nav>
        </div>
    );
}
