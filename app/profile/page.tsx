"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, LogOut } from "lucide-react";
import Link from "next/link";

interface Profile {
    id: string;
    alias: string | null;
    created_at?: string;
}

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            try {
                const { data: userRes } = await supabase.auth.getUser();
                const user = userRes.user;

                if (!user) {
                    if (!cancelled) {
                        router.push("/auth/login");
                    }
                    return;
                }

                const { data, error: dbError } = await supabase
                    .from("profiles")
                    .select("id, alias, created_at")
                    .eq("id", user.id)
                    .single();

                if (!cancelled) {
                    if (dbError) {
                        setError("Failed to load profile");
                    } else {
                        setProfile(data);
                    }
                    setIsLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setError("An error occurred");
                    setIsLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [supabase, router]);

    if (isLoading) {
        return (
            <FeedLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-slate-500 font-medium">Loading profile...</div>
                </div>
            </FeedLayout>
        );
    }

    if (error || !profile) {
        return (
            <FeedLayout>
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-red-600 font-medium mb-4">{error || "Profile not found"}</div>
                    <Link href="/feed" className="text-primary font-semibold hover:underline">
                        Back to feed
                    </Link>
                </div>
            </FeedLayout>
        );
    }

    return (
        <FeedLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
                    <p className="text-slate-500">View and manage your profile information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Username</p>
                            <p className="text-2xl font-bold text-slate-900 mb-4">@{profile.alias || "Guest"}</p>
                            <p className="text-sm text-slate-500">
                                Member since {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <div className="w-5 h-5 text-slate-400">👤</div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t border-slate-100">
                        <Link
                            href="/profile/edit"
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                        >
                            <Edit2 className="w-4 h-4" />
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                    <p className="text-sm text-blue-900">
                        Your profile information is displayed when you interact with the community. Keep your username appropriate and respectful.
                    </p>
                </div>
            </div>
        </FeedLayout>
    );
}
