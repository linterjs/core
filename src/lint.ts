import { NoLintersError } from "./errors";
import {
  linterMap,
  LinterAdapterLintOutput,
  LinterAdapter
} from "./linter-map";

export interface LintInput {
  filePath?: string;
  text: string;
}

export type LintOutput = LinterAdapterLintOutput[];

export async function lint({ filePath, text }: LintInput): Promise<LintOutput> {
  if (linterMap.size === 0) {
    throw new NoLintersError();
  }

  const linters: LinterAdapter[] = [];
  for (const linterFactory of linterMap.values()) {
    linters.push(await linterFactory());
  }

  // Run text through all linters
  // XXX: Linting should be able to be done in parallel
  const lintArgs = { filePath, text };
  const lintOutput = linters.map(async linter => await linter.lint(lintArgs));

  // XXX: Could we return a streaming result for the cli if we lint in parallel?
  // This way the cli could add the linter results for each file as they become
  // available.
  return Promise.all(lintOutput);
}
