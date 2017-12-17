import { DuplicateLinterError } from "./errors";
import { LinterAdapter } from "./linter-adapter";

// TODO: Support config, configPath, modulePath, etc
export type LinterFactory = () => LinterAdapter | Promise<LinterAdapter>;

export const linterMap = new Map<string, LinterFactory>();

export function registerLinter(
  name: string,
  linterFactory: LinterFactory
): void {
  if (linterMap.has(name)) {
    throw new DuplicateLinterError(name);
  }

  linterMap.set(name, linterFactory);
}

// XXX: Add more functionality, enable/disable linters?
