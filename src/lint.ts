import { NoLintersError } from "./errors";
import {
  linterMap,
  LinterAdapterLintOutput,
  LinterAdapter
} from "./linter-map";

export interface LintInput {
  filePath?: string;
  returnArray: boolean;
  text: string;
}

export interface LintInputReturnArray extends LintInput {
  returnArray: true;
}

export interface LintInputReturnPromise extends LintInput {
  returnArray: false;
}

export type LintOutputArray = LinterAdapterLintOutput[];

export type LintOutputPromise = Promise<LinterAdapterLintOutput[]>;

export type LintOutput = LintOutputArray | LintOutputPromise;

export function lint(args: LintInputReturnArray): LintOutputArray;
export function lint(args: LintInputReturnPromise): LintOutputPromise;
export function lint({ filePath, text, returnArray }: LintInput): LintOutput {
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
  return returnArray ? lintOutput : Promise.all(lintOutput);
}
