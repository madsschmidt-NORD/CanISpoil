import { fallbackFeaturedTitles } from "@/lib/content";
import { evaluateTitle } from "@/lib/spoiler";
import { SearchItem } from "@/lib/types";
import { getPopularSpoilerSensitiveShows, hasTmdbCredentials } from "@/lib/tmdb";

export type FeaturedTitle = SearchItem & {
  verdict: ReturnType<typeof evaluateTitle>["verdict"];
  daysRemaining: number;
};

function scoreTitle(item: SearchItem) {
  const evaluation = evaluateTitle(item);
  const verdictWeight = evaluation.verdict === "Too soon" ? 200 : 100;
  const recencyWeight = Math.max(0, 120 - Math.max(evaluation.daysSinceRelease, 0));
  const popularityWeight = Math.min(item.votes, 800000) / 4000;
  return verdictWeight + recencyWeight + popularityWeight;
}

function toFeatured(items: SearchItem[]): FeaturedTitle[] {
  return items
    .map((item) => {
      const evaluation = evaluateTitle(item);
      return {
        ...item,
        verdict: evaluation.verdict,
        daysRemaining: evaluation.daysRemaining
      };
    })
    .filter((item) => item.daysRemaining > 0)
    .sort((a, b) => scoreTitle(b) - scoreTitle(a))
    .slice(0, 8);
}

export async function getFeaturedTitles(): Promise<FeaturedTitle[]> {
  if (!hasTmdbCredentials()) {
    return toFeatured(fallbackFeaturedTitles);
  }

  try {
    const liveTitles = await getPopularSpoilerSensitiveShows();
    const featured = toFeatured(liveTitles);
    if (featured.length > 0) {
      return featured;
    }
  } catch {
    // Fall back to curated titles when live data fails.
  }

  return toFeatured(fallbackFeaturedTitles);
}
