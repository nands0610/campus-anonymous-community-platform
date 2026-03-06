"use client";

import FeedLayout from "@/components/feed/FeedLayout";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Draft = {
  id: string;
  title: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};

export default function DraftsPage() {
  const supabase = createClient();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDrafts() {
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("posts")
      .select("id,title,body,created_at,updated_at")
      .eq("author_id", user.id)
      .eq("status", "draft")
      .order("created_at", { ascending: false });

    if (!error && data) setDrafts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadDrafts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this draft?")) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (!error) {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    }
  }

  return (
    <FeedLayout>
      <div className="max-w-2xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-slate-900">
          My Drafts
        </h1>

        {loading && <p className="text-slate-500">Loading drafts...</p>}

        {!loading && drafts.length === 0 && (
          <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center">
            <p className="text-slate-500">You have no drafts yet.</p>
          </div>
        )}

        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >

            <h2 className="font-semibold text-lg text-slate-900">
              {draft.title || "Untitled draft"}
            </h2>

            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
              {draft.body || "No content yet"}
            </p>

            <div className="flex gap-3 mt-4">

              <Link
                href={`/feed/new?draft=${draft.id}`}
                className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-blue-700 transition"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(draft.id)}
                className="px-4 py-1.5 text-sm font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>
    </FeedLayout>
  );
}