export interface LinterAdapterFormatInput {
  filePath?: string;
  text: string;
}

export type LinterAdapterFormatOutput = string;

export interface LinterAdapterLintInput {
  filePath?: string;
  text: string;
}

export interface LinterAdapterLintOutput {}

export type LinterAdapterFormat = (
  { filePath, text }: LinterAdapterFormatInput
) => LinterAdapterFormatOutput | Promise<LinterAdapterFormatOutput>;

export type LinterAdapterLint = (
  { filePath, text }: LinterAdapterLintInput
) => LinterAdapterLintOutput | Promise<LinterAdapterLintOutput>;

// XXX: LinterAdapters decide if they do anything with text based on filePath and text
// Do we need to forward more info to LinterAdapters?
export interface LinterAdapter {
  format: LinterAdapterFormat;
  lint: LinterAdapterLint;
}
