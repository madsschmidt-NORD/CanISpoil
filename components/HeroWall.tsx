import Link from "next/link";
import { getFeaturedTitles } from "@/lib/featured";

export default async function HeroWall() {
  const tiles = await getFeaturedTitles();

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#090511] p-4 shadow-soft">
      <div className="hero-grid grid grid-cols-3 gap-3 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,10,30,0.9),rgba(8,5,14,0.98))] p-4 md:grid-cols-4">
        {tiles.map((tile, index) => (
          <Link
            key={tile.id}
            href={tile.href}
            className="group flex aspect-[0.78] items-end rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(82,72,160,0.55),rgba(19,14,33,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 hover:border-[#8d98ff]/40 hover:bg-[linear-gradient(180deg,rgba(104,93,195,0.78),rgba(26,18,45,0.98))] hover:shadow-[0_16px_40px_rgba(76,55,180,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] focus:outline-none focus:ring-2 focus:ring-[#8d98ff]/40"
            style={{ transform: `rotate(${index % 2 === 0 ? -6 : 5}deg)` }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.26em] text-[#b7bcff]/55">Max universe</div>
              <div className="mt-2 text-sm font-medium leading-5 text-white/92 md:text-base">{tile.title}</div>
              <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#dbe0ff]/75 group-hover:border-[#8d98ff]/30 group-hover:text-white">
                {tile.verdict}
                {tile.daysRemaining > 0 ? ` · ${tile.daysRemaining} dage tilbage` : ""}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#090511] to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-[36px] ring-1 ring-inset ring-white/5" />
    </div>
  );
}
