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

// XXX: LinterAdapters decide if they do anything with text baed on filePath and text
// Do we need to forward more info to LinterAdapters?
export interface LinterAdapter {
  format({
    filePath,
    text
  }: LinterAdapterFormatInput): LinterAdapterFormatOutput;
  lint({ filePath, text }: LinterAdapterLintInput): LinterAdapterLintOutput;
}

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
