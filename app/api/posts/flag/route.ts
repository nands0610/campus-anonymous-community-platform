import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const { postId, reason, details } = await req.json();

        if (!postId || !reason) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Verify the token and get user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user already reported this post
        const { data: existingReport } = await supabase
            .from("reports")
            .select("id")
            .eq("post_id", postId)
            .eq("reporter_id", user.id)
            .single();

        if (existingReport) {
            return NextResponse.json(
                { error: "You have already reported this post" },
                { status: 400 }
            );
        }

        // Insert report
        const { error: insertError } = await supabase
            .from("reports")
            .insert({
                post_id: postId,
                reporter_id: user.id,
                reason,
                details: details || null,
            });

        if (insertError) {
            return NextResponse.json(
                { error: insertError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Post reported successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
