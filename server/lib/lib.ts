export function panic(reason: string): never {
  throw new Error(reason);
}
export function env(name: string): string {
  return process.env[name] ?? panic(`env: ${name} is not defined`);
}
