import { DuplicateLinterError } from "./errors";

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

export interface LinterAdapterFormatAsync {
  format({
    filePath,
    text
  }: LinterAdapterFormatInput): Promise<LinterAdapterFormatOutput>;
}

export interface LinterAdapterFormatSync {
  formatSync({
    filePath,
    text
  }: LinterAdapterFormatInput): LinterAdapterFormatOutput;
}

export type LinterAdapterFormat =
  | LinterAdapterFormatAsync
  | LinterAdapterFormatSync
  | (LinterAdapterFormatAsync & LinterAdapterFormatSync);

export interface LinterAdapterLintAsync {
  lint({
    filePath,
    text
  }: LinterAdapterLintInput): Promise<LinterAdapterLintOutput>;
}

export interface LinterAdapterLintSync {
  lintSync({ filePath, text }: LinterAdapterLintInput): LinterAdapterLintOutput;
}

export type LinterAdapterLint =
  | LinterAdapterLintAsync
  | LinterAdapterLintSync
  | (LinterAdapterLintAsync & LinterAdapterLintSync);

// XXX: LinterAdapters decide if they do anything with text based on filePath and text
// Do we need to forward more info to LinterAdapters?
export type LinterAdapter = LinterAdapterFormat & LinterAdapterLint;

// TODO: Support config, configPath, modulePath, etc
export type LinterFactory = () => LinterAdapter;

export const linterMap = new Map<string, LinterFactory>();

export function registerLinter(
  name: string,
  linterFactory: LinterFactory
): void {
  if (linterMap.has(name)) {
    throw new DuplicateLinterError(name);
  }

  linterMap.set(name, linterFactory);
}

// XXX: Add more functionality, enable/disable linters?
