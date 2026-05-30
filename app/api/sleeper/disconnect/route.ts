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

    // Delete all Sleeper leagues for this user
    await supabase.from("leagues").delete().eq("user_id", user.id).eq("platform", "sleeper");

    // Clear Sleeper metadata from auth user
    await supabase.auth.updateUser({
      data: { sleeper_user_id: null, sleeper_username: null },
    });

    return NextResponse.json({ success: true, message: "Disconnected from Sleeper" });
  } catch (err) {
    console.error("Sleeper disconnect error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
