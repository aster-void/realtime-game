import { HTTPException } from "hono/http-exception";

export function panic(reason: string): never {
  throw new Error(reason);
}
export function env(name: string): string {
  return process.env[name] ?? panic(`env: ${name} is not defined`);
}
export function unwrap<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) {
    throw new Error("unwrap: value is null or undefined");
  }
  return value;
}
