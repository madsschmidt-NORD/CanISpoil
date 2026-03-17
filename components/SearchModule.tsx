"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchItem } from "@/lib/types";

export default function SearchModule() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as { error?: string };
          throw new Error(payload.error || "Search failed");
        }

        const payload = (await response.json()) as { results: SearchItem[] };
        setResults(payload.results);
      } catch (err) {
        if (controller.signal.aborted) return;
        setResults([]);
        setError(err instanceof Error ? err.message : "Noget gik galt under søgning.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-3 shadow-soft backdrop-blur">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søg efter en film eller serie"
        className="w-full rounded-[22px] border border-white/10 bg-[#0a0610] px-5 py-4 text-lg text-white outline-none placeholder:text-white/30"
      />

      <div className="mt-3 grid gap-2">
        {!query.trim() ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/52">
            Start med en titel. Vi søger live i film og serier, og på serier vurderer vi seneste udsendte sæson som standard.
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/52">
            Leder efter kulturelt sprængfarligt indhold.
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-5 text-sm text-red-100">
            {error}
          </div>
        ) : results.length > 0 ? (
          results.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-white/15 hover:bg-white/[0.06]"
            >
              <div className="h-16 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(82,72,160,0.6),rgba(19,14,33,1))]">
                {item.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.poster} alt={item.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-base font-medium">{item.title}</div>
                <div className="mt-1 text-sm text-white/45">
                  {item.mediaType === "movie" ? "Film" : "Serie · seneste sæson som standard"} · {item.year}
                </div>
              </div>
              <div className="text-sm text-white/35">→</div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/52">
            Ingen oplagte hits. Prøv en mere præcis titel.
          </div>
        )}
      </div>
    </div>
  );
}
