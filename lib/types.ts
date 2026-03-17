export type TitleType = "movie" | "series" | "finale";
export type MediaType = "movie" | "tv";

export type SearchItem = {
  id: string;
  sourceId: number;
  href: string;
  title: string;
  year: string;
  mediaType: MediaType;
  type: TitleType;
  releaseDate: string;
  votes: number;
  poster?: string;
  backdrop?: string;
  platform?: string;
  imdbId?: string;
  overview?: string;
};

export type Evaluation = {
  verdict: "Too soon" | "Ask first" | "Spoil freely";
  body: string;
  baseWindow: number;
  minWindow: number;
  popularityAdjustment: number;
  spoilerWindow: number;
  daysSinceRelease: number;
  daysRemaining: number;
  popularityLabel: string;
};
