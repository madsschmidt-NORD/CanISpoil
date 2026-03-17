import HeroWall from "@/components/HeroWall";
import SearchModule from "@/components/SearchModule";
import { hasTmdbCredentials } from "@/lib/tmdb";

export default function HomePage() {
  const isConfigured = hasTmdbCredentials();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8 md:px-10 lg:px-12">
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.28em] text-white/45">Presented by Max</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">CanISpoil.com</h1>
        </div>
        <div className="rounded-full border border-[#7181ff]/25 bg-[#5868ff]/10 px-3 py-1 text-xs text-[#d7dcff]">
          Cultural spoiler calculator
        </div>
      </header>

      <section className="grid gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">The internet’s least official authority</p>
          <h2 className="mt-4 text-5xl font-semibold leading-none tracking-tight md:text-7xl">Can I spoil it?</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/65 md:text-lg">
            Skriv en titel. Vi vurderer, om kulturen er færdig med at beskytte den.
          </p>

          {!isConfigured ? (
            <div className="mt-8 rounded-[28px] border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-100">
              Appen er kodeklar, men mangler TMDb API token i miljøvariablerne før live-søgning virker.
            </div>
          ) : null}

          <div className="mt-8 max-w-2xl">
            <SearchModule />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Stat label="Film" value="14 dage" sub="minimum 7" />
            <Stat label="Serie" value="18 dage" sub="minimum 10" />
            <Stat label="Megahit bonus" value="-14 dage" sub="snak hurtigere" />
          </div>
        </div>

        <HeroWall />
      </section>
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
      <div className="text-sm text-white/45">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-white/45">{sub}</div>
    </div>
  );
}
