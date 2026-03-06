import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.substring(7);
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Verify JWT and get user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { postId, save } = await request.json();

        if (!postId || typeof save !== "boolean") {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        if (save) {
            const { error } = await supabase
                .from("saved_posts")
                .insert([
                    {
                        user_id: user.id,
                        post_id: postId,
                    },
                ]);

            if (error && !error.message.includes("duplicate")) {
                return NextResponse.json(
                    { error: error.message || "Failed to save post" },
                    { status: 400 }
                );
            }
        } else {
            const { error } = await supabase
                .from("saved_posts")
                .delete()
                .eq("user_id", user.id)
                .eq("post_id", postId);

            if (error) {
                return NextResponse.json(
                    { error: error.message || "Failed to unsave post" },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            saved: save,
        });
    } catch (err: any) {
        console.error("Save post error:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
