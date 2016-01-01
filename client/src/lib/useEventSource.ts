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
      const data = JSON.parse(event.data);
      const parseRes = v.safeParse(schema, data);
      if (!parseRes.success) {
        console.warn(
          "[warn] failed to parse event data",
          data,
          "for issue",
          parseRes.issues,
        );
      }
      cb(data);
    };
    return () => {
      eventSource.close();
    };
  });
}
