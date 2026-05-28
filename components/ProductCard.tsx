import Link from "next/link";
import Image from "next/image";

type Props = {
  name: string;
  description: string;
  status: string;
  live?: boolean;
  logo: string;
  accent: string;
};

export default function ProductCard({ name, description, status, live, logo, accent }: Props) {
  return (
    <div
      className="group rounded-3xl border border-white/10 bg-[#11161d] p-8 transition-all duration-200 hover:-translate-y-1"
      style={{ ["--accent" as string]: accent }}
    >
      <div className="flex items-start justify-between mb-6">
        <Image
          src={logo}
          alt={`${name} logo`}
          width={80}
          height={80}
          className="object-contain"
        />
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
          className="mt-10 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-black transition hover:bg-cyan-300"
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
