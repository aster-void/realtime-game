import { BroadcastChannel } from "node:worker_threads";
import * as v from "valibot";

export function post<T>(path: string, data: T) {
  const bc = new BroadcastChannel(path);
  bc.postMessage(data);
  bc.close();
}

export function listen<T>(
  path: string,
  schema: v.GenericSchema<T>,
  onMessage: (message: T) => void,
) {
  const bc = new BroadcastChannel(path);
  bc.onmessage = (ev: unknown) => {
    const data = (ev as MessageEvent<unknown>).data;
    const parseRes = v.safeParse(schema, data);
    if (!parseRes.success) {
      console.warn("[warn] failed to parse room event", data);
      return;
    }
    onMessage(parseRes.output);
  };
  return () => {
    bc.close();
  };
}
