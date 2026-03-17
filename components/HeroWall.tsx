import { heroTiles } from "@/lib/content";

export default function HeroWall() {
  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#090511] p-4 shadow-soft">
      <div className="hero-grid grid grid-cols-3 gap-3 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,10,30,0.9),rgba(8,5,14,0.98))] p-4 md:grid-cols-4">
        {heroTiles.map((tile, index) => (
          <div
            key={tile}
            className="flex aspect-[0.78] items-end rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(82,72,160,0.55),rgba(19,14,33,0.98))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{ transform: `rotate(${index % 2 === 0 ? -6 : 5}deg)` }}
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.26em] text-[#b7bcff]/55">Max universe</div>
              <div className="mt-2 text-sm font-medium leading-5 text-white/92 md:text-base">{tile}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#090511] to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-[36px] ring-1 ring-inset ring-white/5" />
    </div>
  );
}
