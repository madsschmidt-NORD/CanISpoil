import Link from "next/link";
import { evaluateTitle } from "@/lib/spoiler";
import { SearchItem } from "@/lib/types";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(dateString));
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4 text-sm">
      <span className="text-white/45">{label}</span>
      <span className="text-right text-white/80">{value}</span>
    </div>
  );
}

export default function ResultCard({ item }: { item: SearchItem }) {
  const result = evaluateTitle(item);
  const progress = Math.max(0, Math.min(100, (result.daysSinceRelease / result.spoilerWindow) * 100));

  const verdictClasses: Record<typeof result.verdict, string> = {
    "Too soon": "border-red-400/30 bg-red-400/10 text-red-200",
    "Ask first": "border-amber-400/30 bg-amber-400/10 text-amber-100",
    "Spoil freely": "border-[#7e8dff]/40 bg-[#5969ff]/12 text-[#d8dcff]"
  };

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#08050d] shadow-soft">
      <div className="relative overflow-hidden border-b border-white/10 p-7">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,87,255,0.32),transparent_32%),linear-gradient(180deg,rgba(31,20,60,0.95),rgba(10,7,16,0.96))]"
          style={item.backdrop ? { backgroundImage: `linear-gradient(180deg,rgba(10,7,16,0.35),rgba(10,7,16,0.96)),url(${item.backdrop})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end">
          <div className="h-40 w-28 shrink-0 overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(82,72,160,0.6),rgba(19,14,33,1))]">
            {item.poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.poster} alt={item.title} className="h-full w-full object-cover" />
            ) : null}
          </div>

          <div>
            <div className="text-sm uppercase tracking-[0.22em] text-white/40">CanISpoil ruling</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight">{item.title}</h2>
            <p className="mt-2 text-white/50">
              {item.year} · {item.mediaType === "movie" ? "Film" : item.seasonNumber ? `Serie sæson ${item.seasonNumber}` : "Serie"}
            </p>
            {item.seasonNumber && item.availableSeasons && item.availableSeasons.length > 1 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.availableSeasons.map((season) => (
                  <Link
                    key={season.seasonNumber}
                    href={`/title/tv/${item.sourceId}?season=${season.seasonNumber}`}
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition ${season.seasonNumber === item.seasonNumber ? "border-[#8d98ff]/40 bg-[#5969ff]/12 text-[#d8dcff]" : "border-white/10 bg-white/5 text-white/65 hover:border-white/20 hover:bg-white/10"}`}
                  >
                    S{season.seasonNumber}
                  </Link>
                ))}
              </div>
            ) : null}
            <div className={`mt-5 inline-flex rounded-full border px-4 py-2 text-sm font-medium ${verdictClasses[result.verdict]}`}>
              {result.verdict}
            </div>
            <p className="mt-5 max-w-xl text-lg leading-7 text-white/78">{result.body}</p>
          </div>
        </div>
      </div>

      <div className="p-7">
        {item.overview ? <p className="mb-8 max-w-3xl text-white/68">{item.overview}</p> : null}

        <div className="grid gap-4">
          {item.seasonNumber ? <MetricRow label="Vurderet på" value={`Sæson ${item.seasonNumber}`} /> : null}
          <MetricRow label="Udgivet" value={formatDate(item.releaseDate)} />
          <MetricRow label="IMDb votes" value={item.votes.toLocaleString("en-US")} />
          <MetricRow label="Popularitet" value={result.popularityLabel} />
          <MetricRow label="Basis-karantæne" value={`${result.baseWindow} dage`} />
          <MetricRow label="Popularitetsjustering" value={`${result.popularityAdjustment > 0 ? "+" : ""}${result.popularityAdjustment} dage`} />
          <MetricRow label="Endeligt spoiler-vindue" value={`${result.spoilerWindow} dage`} />
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-white/50">
            <span>Tid gået</span>
            <span>{Math.max(result.daysSinceRelease, 0)} / {result.spoilerWindow} dage</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#6b7cff,#8557ff,#cbb7ff)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-white/35">Social dom</div>
          <div className="mt-3 text-base leading-7 text-white/75">
            {result.daysRemaining > 0
              ? `${result.daysRemaining} dag${result.daysRemaining === 1 ? "" : "e"} tilbage før den er socialt sikker at omtale åbent.`
              : `Spoiler-immuniteten udløb for ${Math.abs(result.daysRemaining)} dag${Math.abs(result.daysRemaining) === 1 ? "" : "e"} siden.`}
          </div>
        </div>
      </div>
    </div>
  );
}
