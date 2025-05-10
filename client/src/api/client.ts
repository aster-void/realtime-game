import { hc } from "hono/client";
import type { App } from "~server";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export type Fetch = typeof globalThis.fetch;
export type Client = ReturnType<typeof hc<App>>;
export function createClient({
  fetch,
}: {
  fetch: Fetch;
}): Client {
  const client = hc<App>(API_ENDPOINT, { fetch });

  return client;
}
