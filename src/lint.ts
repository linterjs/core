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

  const linters: (LinterAdapter | Promise<LinterAdapter>)[] = [];
  for (const linterFactory of linterMap.values()) {
    linters.push(linterFactory());
  }

  // Run text through all linters
  // XXX: Linting should be able to be done in parallel
  const lintArgs = { filePath, text };
  const lintOutput = linters.map(
    async linter => await (await linter).lint(lintArgs)
  );

  // XXX: Could we return a streaming result for the cli if we lint in parallel?
  // This way the cli could add the linter results for each file as they become
  // available.
  return returnArray ? lintOutput : Promise.all(lintOutput);
}
