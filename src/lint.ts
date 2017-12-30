import { NoLintersError } from "./errors";
import { LinterAdapter } from "./linter-adapter";

export interface LintInput {
  filePath?: string;
  text: string;
}

export const enum LintSeverity {
  WARNING = 1,
  ERROR = 2
}

export interface LintMessage {
  column: number;
  endColumn?: number;
  endLine?: number;
  line: number;
  message: string;
  ruleId: string;
  ruleUri?: string;
  severity: LintSeverity;
}

export interface LintOutput {
  errorCount: number;
  filePath?: string;
  messages: LintMessage[];
  warningCount: number;
}

export type LintFunction = (
  { filePath, text }: LintInput
) => Promise<LintOutput>[];

export function createLint(
  linterAdapterPromises: Set<Promise<LinterAdapter>>
): LintFunction {
  return function lint({ filePath, text }: LintInput): Promise<LintOutput>[] {
    if (linterAdapterPromises.size === 0) {
      throw new NoLintersError();
    }

    const lintArgs = { filePath, text };
    const lintOutput: Promise<LintOutput>[] = [];
    // Run text through all linters
    for (const linterAdapterPromise of linterAdapterPromises.values()) {
      // TODO: Handle error in linterFactory and lint?
      lintOutput.push(
        Promise.resolve(linterAdapterPromise).then(({ lint }) => lint(lintArgs))
      );
    }

    // XXX: Could we return a streaming result for the cli if we lint in parallel?
    // This way the cli could add the linter results for each file as they become
    // available.
    return lintOutput;
  };
}
