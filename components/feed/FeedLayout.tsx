"use client";

import { Home, TrendingUp, BarChart2, Search, Bell, User, Plus, Filter, MessageSquare, Heart, Share2, MoreHorizontal, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function FeedLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const supabase = createClient();
    const isPollPage = pathname === "/poll";

    const [alias, setAlias] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
        const { data: userRes } = await supabase.auth.getUser();
        const user = userRes.user;

        if (!user) {
            if (!cancelled) setAlias(null);
            return;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("alias")
            .eq("id", user.id)
            .maybeSingle();

        if (!cancelled) {
            if (error) {
            setAlias(null);
            } else {
            setAlias(data?.alias ?? null);
            }
        }
        }

        loadProfile();

        // Optional: live updates if auth state changes (login/logout)
        const { data: sub } = supabase.auth.onAuthStateChange(() => {
        loadProfile();
        });

        return () => {
        cancelled = true;
        sub.subscription.unsubscribe();
        };
    }, [supabase]);
    const navItems = [
        { icon: Home, label: "Feed", href: "/feed" },
        { icon: TrendingUp, label: "Trending", href: "/trending" },
        { icon: BarChart2, label: "Weekly Poll", href: "/poll" },
    ];

    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);

    useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
        setMenuOpen(false);
        setLogoutOpen(false);
        }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    async function handleLogout() {
    await supabase.auth.signOut();
    setLogoutOpen(false);
    setMenuOpen(false);
    // optional: redirect after logout
    window.location.href = "/";
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Top Navbar - Clean & High Fidelity */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200/60 h-16">
                <div className="max-w-[1280px] mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-10">
                        <Link href="/feed" className="flex items-center gap-2.5">
                            <Image
                                src="/G.png"
                                alt="logo"
                                width={40}
                                height={40}
                            />
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
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setMenuOpen((v) => !v)}
                                className="flex items-center gap-3 py-1 text-slate-700 hover:text-primary transition-all"
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold hidden sm:block">
                                {alias ? `@${alias}` : "Guest"}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Click-outside overlay */}
                            {menuOpen && (
                                <button
                                type="button"
                                className="fixed inset-0 z-40 cursor-default"
                                onClick={() => setMenuOpen(false)}
                                aria-label="Close menu overlay"
                                />
                            )}

                            {/* Dropdown */}
                            {menuOpen && (
                                <div
                                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden"
                                role="menu"
                                >
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                                    <p className="text-sm font-bold text-slate-900 truncate">{alias ? `@${alias}` : "Guest"}</p>
                                </div>

                                <div className="py-1">
                                    <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    role="menuitem"
                                    onClick={() => setMenuOpen(false)}
                                    >
                                    View Profile
                                    </Link>

                                    <Link
                                    href="/settings"
                                    className="block px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    role="menuitem"
                                    onClick={() => setMenuOpen(false)}
                                    >
                                    Settings
                                    </Link>

                                    <button
                                    type="button"
                                    className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    role="menuitem"
                                    onClick={() => {
                                        setLogoutOpen(true);
                                        setMenuOpen(false);
                                    }}
                                    disabled={!alias} // optional: disable logout for Guest
                                    >
                                    Logout
                                    </button>
                                </div>
                                </div>
                            )}
                            </div>
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

                    {!isPollPage && (
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
                    )}
                    </div>

                    {children}
                </main>

                {/* Right Sidebar - High Fidelity Info */}
                {/* ADD DATABASE CONNECTION ONCE AI LAYER DONE */}
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

            {logoutOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    {/* Backdrop */}
                    <button
                    type="button"
                    className="absolute inset-0 bg-black/40"
                    onClick={() => setLogoutOpen(false)}
                    aria-label="Close logout modal"
                    />

                    {/* Modal */}
                    <div className="relative w-[92vw] max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl p-6">
                    <h3 className="text-base font-bold text-slate-900">Confirm logout</h3>
                    <p className="text-sm text-slate-600 mt-2">
                        Do you want to logout?
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                        type="button"
                        onClick={() => setLogoutOpen(false)}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                        Cancel
                        </button>
                        <button
                        type="button"
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700"
                        >
                        Logout
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}
