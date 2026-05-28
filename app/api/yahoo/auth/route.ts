import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_YAHOO_CLIENT_ID!;
  const redirectUri = process.env.YAHOO_REDIRECT_URI!;

  // PKCE state to prevent CSRF
  const state = crypto.randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "fspt-r",
    state,
  });

  const response = NextResponse.redirect(
    `https://api.login.yahoo.com/oauth2/request_auth?${params}`
  );

  // Store state in a short-lived cookie for verification in the callback
  response.cookies.set("yahoo_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });

  return response;
}
