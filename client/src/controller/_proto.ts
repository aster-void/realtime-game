import type { ClientResponse } from "hono/client";

export function useFetch<T>(
  fn: () => undefined | Promise<ClientResponse<T, number, "json">>,
): Promise<T | Record<string, undefined>> {
  return (
    fn()
      ?.then(async (resp) => {
        if (!resp) return {};
        if (!resp.ok) {
          throw new Error(
            `HTTP error! status: ${resp.status} with text ${await resp.text()}`,
          );
        }
        return resp.json();
      })
      .catch((error) => {
        console.error("Error processing:", error);
        return {};
      }) ?? Promise.resolve({})
  );
}
