import { onMount } from "svelte";
import * as v from "valibot";

export function useEventSource<T>(
  path: string,
  schema: v.GenericSchema<T>,
  cb: (data: T) => void,
) {
  onMount(() => {
    const eventSource = new EventSource(path);
    eventSource.onmessage = (event) => {
      const parseRes = v.safeParse(schema, JSON.parse(event.data));
      if (!parseRes.success) {
        console.warn("[warn] failed to parse event data", event.data);
        return;
      }
      cb(parseRes.output);
    };
    return () => {
      eventSource.close();
    };
  });
}
