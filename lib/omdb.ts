import { getOptionalServerEnv } from "@/lib/env";

type OMDbResponse = {
  imdbVotes?: string;
  imdbID?: string;
  Response: "True" | "False";
};

export async function getOmdbVotes(imdbId?: string) {
  const apiKey = getOptionalServerEnv("OMDB_API_KEY");
  if (!apiKey || !imdbId) return undefined;

  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("i", imdbId);

  const response = await fetch(url.toString(), {
    next: { revalidate: 86400 }
  });

  if (!response.ok) return undefined;
  const data = (await response.json()) as OMDbResponse;
  if (data.Response !== "True" || !data.imdbVotes) return undefined;

  return Number(data.imdbVotes.replace(/,/g, ""));
}
