import Link from "next/link";
import { GridironLogo, RinkLogo, HoopsLogo, DugoutLogo } from "@/components/SportLogo";
import type { ReactNode } from "react";

const LOGOS: Record<string, ReactNode> = {
  Gridiron: <GridironLogo size={56} />,
  Rink: <RinkLogo size={56} />,
  Hoops: <HoopsLogo size={56} />,
  Dugout: <DugoutLogo size={56} />,
};

type Props = {
  name: string;
  description: string;
  status: string;
  live?: boolean;
  accent: string;
};

export default function ProductCard({ name, description, status, live, accent }: Props) {
  if (live) {
    return (
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-10 glass-blur transition-all hover:border-hockey-red/60 hover:shadow-[0_0_40px_rgba(255,59,59,0.2)]">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-hockey-red/10 blur-3xl" />

        <div className="relative mb-12 flex items-start justify-between">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-hockey-red/30 bg-hockey-red/10 transition-all duration-500 group-hover:neo-glow-red">
            <div className="absolute inset-0 animate-pulse bg-hockey-red/5" />
            <div className="relative z-10">{LOGOS[name]}</div>
          </div>
          <div className="flex items-center gap-1.5 rounded border border-hockey-red/40 bg-hockey-red/20 px-2 py-0.5 glass-blur">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-hockey-red" />
            <span className="font-mono text-[10px] font-bold text-hockey-red">{status}</span>
          </div>
        </div>

        <h3 className="mb-2 font-display text-[28px] font-bold tracking-tight">{name}</h3>
        <p className="mb-12 text-on-surface-variant">{description}</p>

        <Link
          href="/login"
          className="mt-auto w-full rounded-lg border border-white/20 bg-hockey-red py-3 text-center font-bold text-white neo-glow-red transition-all hover:brightness-110 active:scale-95"
        >
          Open Engine
        </Link>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col rounded-2xl border border-white/5 bg-white/5 p-10 glass-blur opacity-80 grayscale-[0.3] transition-all hover:grayscale-0">
      <div className="mb-12 flex items-start justify-between">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-xl border border-white/10"
          style={{ backgroundColor: `${accent}0d` }}
        >
          {LOGOS[name]}
        </div>
        <div className="rounded border border-white/10 bg-surface-variant/40 px-2 py-0.5 glass-blur">
          <span className="font-mono text-[10px] font-bold text-on-surface-variant">STAGING</span>
        </div>
      </div>

      <h3 className="mb-2 font-display text-[28px] font-bold tracking-tight">{name}</h3>
      <p className="mb-12 text-on-surface-variant">{description}</p>

      <button
        disabled
        className="mt-auto w-full cursor-not-allowed rounded-lg border border-white/10 bg-surface-variant/20 py-3 font-mono text-xs font-bold uppercase text-on-surface-variant"
      >
        Coming Soon
      </button>
    </div>
  );
}
