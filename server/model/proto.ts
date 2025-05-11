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
  bc.onmessage = (ev) => {
    const parseRes = v.safeParse(schema, ev.data);
    if (!parseRes.success) {
      console.warn(
        "[warn] failed to parse room event",
        ev.data,
        "for error:",
        parseRes.issues,
      );
    }
    onMessage(ev.data);
  };
  return () => {
    bc.close();
  };
}
