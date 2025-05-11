import type { App } from "@repo/server";
import { hc } from "hono/client";

export const API_ENDPOINT: string = import.meta.env.VITE_API_ENDPOINT;
if (!API_ENDPOINT) {
  throw new Error("VITE_API_ENDPOINT is not defined");
}

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
