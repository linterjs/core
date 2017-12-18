import { DuplicateLinterError } from "./errors";
import { Linter } from "./linter";

// TODO: Support config, configPath, modulePath, etc
export type LinterFactory = () => Linter | Promise<Linter>;

export const linterMap = new Map<string, LinterFactory>();

export interface LinterProvider {
  linterFactory: LinterFactory;
  name: string;
}

export function registerLinter({ linterFactory, name }: LinterProvider): void {
  if (linterMap.has(name)) {
    throw new DuplicateLinterError(name);
  }

  if (name === "prettier") {
    const entries: [string, LinterFactory][] = [
      [name, linterFactory],
      ...linterMap.entries()
    ];

    linterMap.clear();

    for (const [name, linterFactory] of entries) {
      linterMap.set(name, linterFactory);
    }
  } else {
    linterMap.set(name, linterFactory);
  }
}

// XXX: Add more functionality, enable/disable linters?
