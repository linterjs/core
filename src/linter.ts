import { FormatInput, FormatOutput } from "./format";
import { LintInput, LintOutput } from "./lint";

export type LinterFormat = (
  { filePath, text }: FormatInput
) => FormatOutput | Promise<FormatOutput>;

export type LinterLint = (
  { filePath, text }: LintInput
) => LintOutput | Promise<LintOutput>;

// XXX: LinterAdapters decide if they do anything with text based on filePath and text
// Do we need to forward more info to LinterAdapters?
export interface Linter {
  format: LinterFormat;
  lint: LinterLint;
}
