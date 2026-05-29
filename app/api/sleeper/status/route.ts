import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ connected: false });

  const sleeperUserId = user.user_metadata?.sleeper_user_id;
  const sleeperUsername = user.user_metadata?.sleeper_username;

  return NextResponse.json({
    connected: Boolean(sleeperUserId),
    username: sleeperUsername || null,
  });
}
