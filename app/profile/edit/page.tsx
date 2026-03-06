"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Profile {
    id: string;
    alias: string | null;
}

export default function EditProfilePage() {
    const supabase = createClient();
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [alias, setAlias] = useState("");
    const [aliasError, setAliasError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
                    .select("id, alias")
                    .eq("id", user.id)
                    .single();

                if (!cancelled) {
                    if (dbError) {
                        setAliasError("Failed to load profile");
                    } else {
                        setProfile(data);
                        setAlias(data?.alias || "");
                    }
                    setIsLoading(false);
                }
            } catch (err) {
                if (!cancelled) {
                    setAliasError("An error occurred");
                    setIsLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, [supabase, router]);

    async function checkAliasAvailable(newAlias: string): Promise<boolean> {
        if (newAlias === profile?.alias) {
            return true; // Same alias is fine
        }

        try {
            const res = await fetch("/api/auth/check-alias", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ alias: newAlias }),
            });

            if (!res.ok) return false;
            const data = (await res.json()) as { available?: boolean };
            return Boolean(data.available);
        } catch {
            return false;
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setAliasError(null);
        setSuccessMsg(null);
        setIsSaving(true);

        const cleanedAlias = alias.trim();

        // Validation
        if (!cleanedAlias) {
            setAliasError("Username cannot be empty");
            setIsSaving(false);
            return;
        }

        if (cleanedAlias.length < 3) {
            setAliasError("Username must be at least 3 characters");
            setIsSaving(false);
            return;
        }

        if (cleanedAlias.length > 30) {
            setAliasError("Username must be no more than 30 characters");
            setIsSaving(false);
            return;
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(cleanedAlias)) {
            setAliasError("Username can only contain letters, numbers, underscores, and hyphens");
            setIsSaving(false);
            return;
        }

        // Check availability
        const available = await checkAliasAvailable(cleanedAlias);
        if (!available && cleanedAlias !== profile?.alias) {
            setAliasError("Username already taken. Try another");
            setIsSaving(false);
            return;
        }

        // Update profile
        try {
            const { error } = await supabase
                .from("profiles")
                .update({ alias: cleanedAlias })
                .eq("id", profile?.id);

            if (error) {
                setAliasError(error.message);
            } else {
                setSuccessMsg("Profile updated successfully!");
                setProfile({ ...profile!, alias: cleanedAlias });
                setTimeout(() => {
                    router.push("/profile");
                }, 1500);
            }
        } catch (err: any) {
            setAliasError(err?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <FeedLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-slate-500 font-medium">Loading profile...</div>
                </div>
            </FeedLayout>
        );
    }

    return (
        <FeedLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center gap-3">
                    <Link
                        href="/profile"
                        className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-slate-100 transition-all"
                        title="Go back to profile"
                    >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
                        <p className="text-slate-500 text-sm mt-1">Update your profile information</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 mb-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                Username
                            </label>
                            <div className="flex items-center gap-2 px-4 py-1 bg-slate-50 border border-slate-200 rounded-lg w-fit mb-2">
                                <span className="text-slate-500 font-semibold">@</span>
                            </div>
                            <input
                                type="text"
                                value={alias}
                                onChange={(e) => {
                                    setAlias(e.target.value);
                                    setAliasError(null);
                                }}
                                placeholder="Enter your username"
                                className={`block w-full px-4 py-3 bg-slate-50 border rounded-lg text-sm font-medium outline-none transition-all ${aliasError
                                        ? "border-red-300 focus:bg-white focus:border-red-400"
                                        : "border-slate-200 focus:bg-white focus:border-primary/20"
                                    }`}
                                disabled={isSaving}
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                3-30 characters. Letters, numbers, underscores, and hyphens only.
                            </p>
                            {aliasError && <p className="text-xs font-semibold text-red-600 mt-2">{aliasError}</p>}
                        </div>

                        {/* Success Message */}
                        {successMsg && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-semibold text-green-700">{successMsg}</p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-6 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                            <Link
                                href="/profile"
                                className="px-6 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Information Section */}
                <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
                    <h3 className="text-sm font-bold text-blue-900 mb-3">Username Guidelines</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span>Keep it professional and respectful</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span>Avoid impersonating others</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold">•</span>
                            <span>No offensive or inappropriate content</span>
                        </li>
                    </ul>
                </div>
            </div>
        </FeedLayout>
    );
}
