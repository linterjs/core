import { FormatInput, FormatOutput } from "./format";
import { LintInput, LintOutput } from "./lint";

export type LinterAdapterFormat = (
  { filePath, text }: FormatInput
) => FormatOutput | Promise<FormatOutput>;

export type LinterAdapterLint = (
  { filePath, text }: LintInput
) => LintOutput | Promise<LintOutput>;

// XXX: LinterAdapters decide if they do anything with text based on filePath and text
// Do we need to forward more info to LinterAdapters?
export interface LinterAdapter {
  format: LinterAdapterFormat;
  lint: LinterAdapterLint;
}

// TODO: Support config, configPath, modulePath, etc
export type LinterFactory = () => LinterAdapter | Promise<LinterAdapter>;
