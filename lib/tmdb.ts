import { getOptionalServerEnv, getRequiredServerEnv } from "@/lib/env";
import { SearchItem, SeasonInfo } from "@/lib/types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

function buildHeaders() {
  const token = getRequiredServerEnv("TMDB_API_READ_ACCESS_TOKEN");
  return {
    accept: "application/json",
    Authorization: `Bearer ${token}`
  };
}

async function tmdbFetch<T>(pathname: string, searchParams?: URLSearchParams): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${pathname}`);
  if (searchParams) {
    url.search = searchParams.toString();
  }

  const response = await fetch(url.toString(), {
    headers: buildHeaders(),
    next: { revalidate: 3600 }
  });

  if (!response.ok) {
    throw new Error(`TMDb request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function imageUrl(path?: string | null, size: "w500" | "w780" = "w500") {
  if (!path) return undefined;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

type TMDbSearchResult = {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  vote_count?: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
};

type TMDbSearchResponse = { results: TMDbSearchResult[] };
type TMDbTvListResponse = { results: Omit<TMDbSearchResult, "media_type">[] };

type TMDbSeasonListItem = {
  season_number: number;
  air_date?: string;
  episode_count?: number;
  name: string;
  poster_path?: string | null;
};

type TMDbMovieDetails = {
  id: number;
  title: string;
  release_date: string;
  vote_count: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  status?: string;
  external_ids?: { imdb_id?: string | null };
};

type TMDbTvDetails = {
  id: number;
  name: string;
  first_air_date: string;
  vote_count: number;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  status?: string;
  seasons?: TMDbSeasonListItem[];
  external_ids?: { imdb_id?: string | null };
};

type TMDbSeasonDetails = {
  id: string;
  air_date: string;
  name: string;
  overview?: string;
  poster_path?: string | null;
  season_number: number;
  episodes?: Array<{ air_date?: string }>;
};

function toTitleType(mediaType: "movie" | "tv") {
  return mediaType === "movie" ? "movie" : "series";
}

function getYearFromDate(date?: string) {
  return date?.slice(0, 4) || "Unknown";
}

function getTodayIso() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeSeasonList(seasons?: TMDbSeasonListItem[]): SeasonInfo[] {
  const today = getTodayIso();

  return (seasons ?? [])
    .filter((season) => season.season_number > 0 && Boolean(season.air_date) && season.air_date! <= today)
    .map((season) => ({
      seasonNumber: season.season_number,
      name: season.name,
      airDate: season.air_date!,
      episodeCount: season.episode_count
    }))
    .sort((a, b) => b.seasonNumber - a.seasonNumber);
}

function getLatestSeason(seasons?: TMDbSeasonListItem[]): SeasonInfo | undefined {
  return normalizeSeasonList(seasons)[0];
}

function buildSeasonHref(sourceId: number, seasonNumber: number) {
  return `/title/tv/${sourceId}?season=${seasonNumber}`;
}

function normalizeSearchResult(result: TMDbSearchResult): SearchItem | null {
  if (result.media_type !== "movie" && result.media_type !== "tv") return null;

  const title = result.media_type === "movie" ? result.title : result.name;
  const releaseDate = result.media_type === "movie" ? result.release_date : result.first_air_date;

  if (!title || !releaseDate) return null;

  return {
    id: `${result.media_type}-${result.id}`,
    sourceId: result.id,
    href: `/title/${result.media_type}/${result.id}`,
    title,
    year: getYearFromDate(releaseDate),
    mediaType: result.media_type,
    type: toTitleType(result.media_type),
    releaseDate,
    votes: result.vote_count ?? 0,
    poster: imageUrl(result.poster_path),
    backdrop: imageUrl(result.backdrop_path, "w780"),
    overview: result.overview
  };
}

export async function searchTitles(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const params = new URLSearchParams({
    query: trimmed,
    include_adult: "false",
    language: "en-US",
    page: "1"
  });

  const data = await tmdbFetch<TMDbSearchResponse>("/search/multi", params);
  return data.results.map(normalizeSearchResult).filter(Boolean).slice(0, 8) as SearchItem[];
}

export async function getTitleById(mediaType: "movie" | "tv", id: string, seasonNumber?: number): Promise<SearchItem> {
  const params = new URLSearchParams({ append_to_response: "external_ids", language: "en-US" });

  if (mediaType === "movie") {
    const data = await tmdbFetch<TMDbMovieDetails>(`/movie/${id}`, params);
    return {
      id: `${mediaType}-${data.id}`,
      sourceId: data.id,
      href: `/title/${mediaType}/${data.id}`,
      title: data.title,
      year: getYearFromDate(data.release_date),
      mediaType,
      type: "movie",
      releaseDate: data.release_date,
      votes: data.vote_count ?? 0,
      poster: imageUrl(data.poster_path),
      backdrop: imageUrl(data.backdrop_path, "w780"),
      imdbId: data.external_ids?.imdb_id ?? undefined,
      overview: data.overview,
      platform: data.status
    };
  }

  const data = await tmdbFetch<TMDbTvDetails>(`/tv/${id}`, params);
  const availableSeasons = normalizeSeasonList(data.seasons);
  const selectedSeason = seasonNumber
    ? availableSeasons.find((season) => season.seasonNumber === seasonNumber)
    : getLatestSeason(data.seasons);

  if (selectedSeason) {
    const seasonData = await tmdbFetch<TMDbSeasonDetails>(`/tv/${id}/season/${selectedSeason.seasonNumber}`, new URLSearchParams({ language: "en-US" }));
    return {
      id: `${mediaType}-${data.id}-season-${selectedSeason.seasonNumber}`,
      sourceId: data.id,
      href: buildSeasonHref(data.id, selectedSeason.seasonNumber),
      title: `${data.name} Season ${selectedSeason.seasonNumber}`,
      seriesTitle: data.name,
      seasonNumber: selectedSeason.seasonNumber,
      seasonLabel: seasonData.name || `Season ${selectedSeason.seasonNumber}`,
      year: getYearFromDate(seasonData.air_date || selectedSeason.airDate),
      mediaType,
      type: "series",
      releaseDate: seasonData.air_date || selectedSeason.airDate,
      votes: data.vote_count ?? 0,
      poster: imageUrl(seasonData.poster_path || data.poster_path),
      backdrop: imageUrl(data.backdrop_path, "w780"),
      imdbId: data.external_ids?.imdb_id ?? undefined,
      overview: seasonData.overview || data.overview,
      platform: data.status,
      availableSeasons
    };
  }

  return {
    id: `${mediaType}-${data.id}`,
    sourceId: data.id,
    href: `/title/${mediaType}/${data.id}`,
    title: data.name,
    seriesTitle: data.name,
    year: getYearFromDate(data.first_air_date),
    mediaType,
    type: "series",
    releaseDate: data.first_air_date,
    votes: data.vote_count ?? 0,
    poster: imageUrl(data.poster_path),
    backdrop: imageUrl(data.backdrop_path, "w780"),
    imdbId: data.external_ids?.imdb_id ?? undefined,
    overview: data.overview,
    platform: data.status,
    availableSeasons
  };
}

export async function getPopularSpoilerSensitiveShows() {
  const language = "en-US";
  const popularParams = new URLSearchParams({ language, page: "1" });
  const trendingParams = new URLSearchParams({ language });

  const [popular, trending] = await Promise.all([
    tmdbFetch<TMDbTvListResponse>("/tv/popular", popularParams),
    tmdbFetch<TMDbTvListResponse>("/trending/tv/week", trendingParams)
  ]);

  const merged = [...popular.results, ...trending.results];
  const unique = new Map<number, SearchItem>();

  for (const result of merged) {
    const normalized = normalizeSearchResult({
      ...result,
      media_type: "tv"
    });

    if (!normalized) continue;

    try {
      const seasonAware = await getTitleById("tv", String(normalized.sourceId));
      unique.set(seasonAware.sourceId, seasonAware);
    } catch {
      unique.set(normalized.sourceId, normalized);
    }
  }

  return Array.from(unique.values());
}

export function hasTmdbCredentials() {
  return Boolean(getOptionalServerEnv("TMDB_API_READ_ACCESS_TOKEN"));
}
