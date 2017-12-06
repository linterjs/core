import { LinterAdapter, LinterFactory, linterMap, LintOutput } from "./linter-map";

export interface LintInput {
  filePath: string,
  text: string,
}

function lint({ filePath, text }: LintInput) {
  // Get a list of linters
  const linters = Array.from(linterMap.values()).map(linterFactory => linterFactory());

  // Run text through all linters
  const linterOutputList = linters.map(linter => linter.lint({ filePath, text }));
  
  // TODO: Pretty print output from all linters
}
