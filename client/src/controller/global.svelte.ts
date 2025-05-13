import { Context, PersistedState } from "runed";

const globalContext = new Context<GlobalController>("global");

export function useGlobal() {
  return globalContext.get();
}

export class GlobalController {
  username = $state("");
  readonly userId = new PersistedState<string>("userId", crypto.randomUUID(), {
    storage: "session",
  }).current;
  constructor() {
    globalContext.set(this);
  }
}
