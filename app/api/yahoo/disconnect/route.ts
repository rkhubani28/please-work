import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Delete all Yahoo leagues for this user
    await supabase.from("leagues").delete().eq("user_id", user.id).eq("platform", "yahoo");

    // Clear Yahoo metadata from auth user
    await supabase.auth.updateUser({
      data: { yahoo_user_id: null, yahoo_username: null },
    });

    // Delete cookies
    const response = NextResponse.json({ success: true, message: "Disconnected from Yahoo" });
    response.cookies.delete("yahoo_access_token");
    response.cookies.delete("yahoo_refresh_token");

    return response;
  } catch (err) {
    console.error("Yahoo disconnect error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
