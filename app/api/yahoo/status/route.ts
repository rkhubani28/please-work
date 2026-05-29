import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const connected = Boolean(request.cookies.get("yahoo_access_token")?.value);
  return NextResponse.json({ connected });
}
