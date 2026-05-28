import Link from "next/link";
import { GridironLogo, RinkLogo, HoopsLogo, DugoutLogo } from "@/components/SportLogo";
import type { ReactNode } from "react";

const LOGOS: Record<string, ReactNode> = {
  Gridiron: <GridironLogo size={72} />,
  Rink: <RinkLogo size={72} />,
  Hoops: <HoopsLogo size={72} />,
  Dugout: <DugoutLogo size={72} />,
};

type Props = {
  name: string;
  description: string;
  status: string;
  live?: boolean;
  accent: string;
};

export default function ProductCard({ name, description, status, live, accent }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#11161d] p-8 transition-all duration-200 hover:-translate-y-1 hover:border-white/20">
      <div className="flex items-start justify-between mb-6">
        <div>{LOGOS[name]}</div>
        <div
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
            live ? "bg-cyan-400/15 text-cyan-300" : "bg-zinc-800 text-zinc-400"
          }`}
        >
          {status}
        </div>
      </div>

      <h3 className="text-5xl font-black">{name}</h3>
      <p className="mt-4 text-lg text-zinc-400">{description}</p>

      {live ? (
        <Link
          href="/login"
          className="mt-10 inline-block rounded-xl px-6 py-3 font-semibold text-black transition hover:opacity-90"
          style={{ backgroundColor: accent }}
        >
          Open Engine
        </Link>
      ) : (
        <button
          disabled
          className="mt-10 cursor-not-allowed rounded-xl border border-zinc-700 px-6 py-3 font-semibold text-zinc-500"
        >
          Coming Soon
        </button>
      )}
    </div>
  );
}
