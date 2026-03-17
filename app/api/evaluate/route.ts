import { NextRequest, NextResponse } from "next/server";
import { getOmdbVotes } from "@/lib/omdb";
import { evaluateTitle } from "@/lib/spoiler";
import { getTitleById } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const mediaType = request.nextUrl.searchParams.get("mediaType");
  const id = request.nextUrl.searchParams.get("id");

  if ((mediaType !== "movie" && mediaType !== "tv") || !id) {
    return NextResponse.json({ error: "Missing or invalid params" }, { status: 400 });
  }

  try {
    const item = await getTitleById(mediaType, id);
    const omdbVotes = await getOmdbVotes(item.imdbId);
    const enriched = omdbVotes ? { ...item, votes: omdbVotes } : item;

    return NextResponse.json({
      item: enriched,
      evaluation: evaluateTitle(enriched)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
