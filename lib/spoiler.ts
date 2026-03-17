import { Evaluation, SearchItem, TitleType } from "@/lib/types";

function getBaseWindow(type: TitleType) {
  if (type === "movie") return 14;
  if (type === "finale") return 21;
  return 18;
}

function getMinWindow(type: TitleType) {
  if (type === "movie") return 7;
  if (type === "finale") return 14;
  return 10;
}

function getPopularityAdjustment(votes: number) {
  if (votes < 5000) return 14;
  if (votes < 25000) return 7;
  if (votes < 100000) return 0;
  if (votes < 500000) return -7;
  return -14;
}

function getPopularityLabel(votes: number) {
  if (votes < 5000) return "Niche";
  if (votes < 25000) return "Emerging";
  if (votes < 100000) return "Known";
  if (votes < 500000) return "Big";
  return "Massive";
}

function diffDaysFromToday(dateString: string) {
  const oneDay = 1000 * 60 * 60 * 24;
  const today = new Date();
  const release = new Date(dateString);
  const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utcRelease = Date.UTC(release.getFullYear(), release.getMonth(), release.getDate());
  return Math.floor((utcToday - utcRelease) / oneDay);
}

export function evaluateTitle(item: SearchItem): Evaluation {
  const baseWindow = getBaseWindow(item.type);
  const minWindow = getMinWindow(item.type);
  const popularityAdjustment = getPopularityAdjustment(item.votes);
  const spoilerWindow = Math.max(minWindow, baseWindow + popularityAdjustment);
  const daysSinceRelease = diffDaysFromToday(item.releaseDate);
  const daysRemaining = spoilerWindow - daysSinceRelease;
  const popularityLabel = getPopularityLabel(item.votes);

  if (daysRemaining > 7) {
    return {
      verdict: "Too soon",
      body: "Still under spoiler protection. Keep it vague.",
      baseWindow,
      minWindow,
      popularityAdjustment,
      spoilerWindow,
      daysSinceRelease,
      daysRemaining,
      popularityLabel
    };
  }

  if (daysRemaining > 0) {
    return {
      verdict: "Ask first",
      body: "Close, but not clean. Best to check before you say too much.",
      baseWindow,
      minWindow,
      popularityAdjustment,
      spoilerWindow,
      daysSinceRelease,
      daysRemaining,
      popularityLabel
    };
  }

  return {
    verdict: "Spoil freely",
    body: "Culturally speaking, people have had time.",
    baseWindow,
    minWindow,
    popularityAdjustment,
    spoilerWindow,
    daysSinceRelease,
    daysRemaining,
    popularityLabel
  };
}
