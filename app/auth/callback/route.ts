import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type"); // "signup" | "recovery" | etc.
  const code = url.searchParams.get("code"); // OAuth/PKCE style

  const cookieStore = await cookies();

  let response = NextResponse.redirect(new URL("/feed", url.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
    return response;
  }

  if (token_hash && type) {
    await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });
    return response;
  }

  // If nothing to verify, go back to login
  return NextResponse.redirect(new URL("/auth/login", url.origin));
}