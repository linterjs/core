import { LinterAdapter, LinterFactory, linterMap } from "./linter-map";

export interface LintInput {
  filePath?: string;
  text: string;
}

export interface LintOutput {}

export function lint({ filePath, text }: LintInput): LintOutput {
  // Get a list of linters
  const linters = Array.from(linterMap.values()).map(linterFactory =>
    linterFactory()
  );

  // Run text through all linters
  // XXX: Linting should be able to be done in parallel
  const linterOutputList = linters.map(linter =>
    linter.lint({ filePath, text })
  );

  // XXX: Could we return a streaming result for the cli if we lint in parallel?
  // This way the cli could add the linter results for each file as they become
  // available.
  return {};
}
