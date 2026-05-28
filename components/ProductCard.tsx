import Link from "next/link";

type Props = {
  name: string;
  description: string;
  status: string;
  live?: boolean;
};

export default function ProductCard({
  name,
  description,
  status,
  live,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#11161d] p-8 transition-all duration-200 hover:border-cyan-400/50 hover:-translate-y-1">
      <div
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
          live
            ? "bg-cyan-400/15 text-cyan-300"
            : "bg-zinc-800 text-zinc-400"
        }`}
      >
        {status}
      </div>

      <h3 className="mt-6 text-5xl font-black">{name}</h3>

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