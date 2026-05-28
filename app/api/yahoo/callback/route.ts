import { NextResponse, type NextRequest } from "next/server";

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
