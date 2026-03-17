import Link from "next/link";
import { notFound } from "next/navigation";
import ResultCard from "@/components/ResultCard";
import { getOmdbVotes } from "@/lib/omdb";
import { getTitleById } from "@/lib/tmdb";

export default async function TitlePage({
  params
}: {
  params: Promise<{ mediaType: string; id: string }>;
}) {
  const { mediaType, id } = await params;

  if (mediaType !== "movie" && mediaType !== "tv") {
    notFound();
  }

  try {
    const item = await getTitleById(mediaType, id);
    const omdbVotes = await getOmdbVotes(item.imdbId);
    const enriched = omdbVotes ? { ...item, votes: omdbVotes } : item;

    return (
      <main className="mx-auto min-h-screen max-w-5xl px-6 py-8 md:px-10">
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/45">Presented by Max</div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">CanISpoil.com</div>
          </div>
          <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 transition hover:bg-white/5">
            Tilbage
          </Link>
        </div>

        <ResultCard item={enriched} />
      </main>
    );
  } catch {
    notFound();
  }
}
