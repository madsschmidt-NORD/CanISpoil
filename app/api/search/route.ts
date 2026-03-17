import { NextRequest, NextResponse } from "next/server";
import { searchTitles } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTitles(q);
    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
