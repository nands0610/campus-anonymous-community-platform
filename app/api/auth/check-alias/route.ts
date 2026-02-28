import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { alias } = await req.json().catch(() => ({}));

  const cleaned = String(alias ?? "").trim().toLowerCase();
  if (!cleaned) {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("alias", cleaned)
    .limit(1);

  if (error) {
    return NextResponse.json({ available: false }, { status: 500 });
  }

  return NextResponse.json({ available: data.length === 0 });
}