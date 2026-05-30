import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get("yahoo_oauth_state")?.value;

  if (!code || state !== storedState) {
    return NextResponse.redirect(`${origin}/dashboard?error=yahoo_auth_failed`);
  }

  const clientId = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID!;
  const clientSecret = process.env.YAHOO_CLIENT_SECRET!;
  const redirectUri = process.env.YAHOO_REDIRECT_URI!;

  // Exchange code for token
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/dashboard?error=yahoo_token_failed`);
  }

  const tokens = await tokenRes.json();

  // Fetch Yahoo user info to get yahoo_user_id
  let yahooUserId: string | null = null;
  try {
    const userRes = await fetch("https://fantasysports.yahooapis.com/fantasy/v2/users;format=json", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      yahooUserId = userData.fantasy_content?.users?.[0]?.user?.[0]?.id;
    }
  } catch (err) {
    console.error("Failed to fetch Yahoo user info:", err);
  }

  // Store yahoo_user_id in auth metadata for future reference
  if (yahooUserId) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Store yahoo_user_id in auth metadata
      await supabase.auth.updateUser({
        data: { yahoo_user_id: yahooUserId },
      });
    }
  }

  // Store the Yahoo access token in a cookie for subsequent API calls
  const response = NextResponse.redirect(`${origin}/dashboard?yahoo=connected`);
  response.cookies.set("yahoo_access_token", tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: tokens.expires_in ?? 3600,
    path: "/",
  });
  response.cookies.set("yahoo_refresh_token", tokens.refresh_token ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  response.cookies.delete("yahoo_oauth_state");

  return response;
}
