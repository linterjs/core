export interface LinterFormatInput {
  filePath?: string;
  text: string;
}

export type LinterFormatOutput = string;

export interface LinterLintInput {
  filePath?: string;
  text: string;
}

export interface LinterLintOutput {}

export type LinterFormat = (
  { filePath, text }: LinterFormatInput
) => LinterFormatOutput | Promise<LinterFormatOutput>;

export type LinterLint = (
  { filePath, text }: LinterLintInput
) => LinterLintOutput | Promise<LinterLintOutput>;

// XXX: LinterAdapters decide if they do anything with text based on filePath and text
// Do we need to forward more info to LinterAdapters?
export interface Linter {
  format: LinterFormat;
  lint: LinterLint;
}
