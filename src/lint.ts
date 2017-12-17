import { NoLintersError } from "./errors";
import { LinterAdapterLintOutput } from "./linter-adapter";
import { linterMap } from "./linter-map";

export interface LintInput {
  filePath?: string;
  text: string;
}

export type LintOutput = Promise<LinterAdapterLintOutput>[];

export function lint({ filePath, text }: LintInput): LintOutput {
  if (linterMap.size === 0) {
    throw new NoLintersError();
  }

  const lintArgs = { filePath, text };
  const lintOutput: Promise<LinterAdapterLintOutput>[] = [];
  // Run text through all linters
  for (const linterFactory of linterMap.values()) {
    lintOutput.push(
      Promise.resolve(linterFactory()).then(({ lint }) => lint(lintArgs))
    );
  }

  // XXX: Could we return a streaming result for the cli if we lint in parallel?
  // This way the cli could add the linter results for each file as they become
  // available.
  return lintOutput;
}
