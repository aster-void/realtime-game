import { Context } from "runed";

const globalContext = new Context<GlobalController>("global");

export function useGlobal() {
  return globalContext.get();
}

export class GlobalController {
  username = $state("");
  readonly userId = crypto.randomUUID();
  constructor() {
    globalContext.set(this);
  }
}
