import { extname } from "path";
import { NoLinterProvidersError } from "./errors";
import { LinterAdapter } from "./linter-adapter";
import { logger } from "./logger";

export interface LintInput {
  filePath: string;
  text: string;
}

export const enum LintSeverity {
  WARNING = 1,
  ERROR = 2,
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
  filePath: string;
  messages: LintMessage[];
  warningCount: number;
}

export type LintFunction = ({
  filePath,
  text,
}: LintInput) => Promise<LintOutput>[];

export function createLint(
  linterAdapterPromisesBySupportedExtensions: Map<
    string,
    Set<Promise<LinterAdapter>>
  >,
): LintFunction {
  return function lint({ filePath, text }: LintInput): Promise<LintOutput>[] {
    if (linterAdapterPromisesBySupportedExtensions.size === 0) {
      logger.debug("No linter providers found, not linting.");
      throw new NoLinterProvidersError();
    }

    const defaultResult: LintOutput = {
      filePath,
      errorCount: 0,
      messages: [],
      warningCount: 0,
    };

    const linterAdapterPromises = linterAdapterPromisesBySupportedExtensions.get(
      extname(filePath),
    );

    if (!linterAdapterPromises || linterAdapterPromises.size === 0) {
      return [Promise.resolve(defaultResult)];
    }

    const lintArgs = { filePath, text };
    const lintOutput: Promise<LintOutput>[] = [];
    // Run text through all linters
    for (const linterAdapterPromise of linterAdapterPromises.values()) {
      // TODO: Handle error in linterFactory and lint?
      lintOutput.push(
        Promise.resolve(linterAdapterPromise).then((linterAdapter) =>
          linterAdapter.lint(lintArgs),
        ),
      );
    }

    // XXX: Could we return a streaming result for the cli if we lint in parallel?
    // This way the cli could add the linter results for each file as they become
    // available.
    return lintOutput;
  };
}
