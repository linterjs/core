export interface FormatOutput {}

export interface LintOutput {}

// XXX: LinterAdapters decide if they do anything with text baed on filePath and text
// Do we need to forward more info to LinterAdapters?
export interface LinterAdapter {
  format({ filePath, text }: { filePath: string; text: string }): FormatOutput,
  lint({ filePath, text }: { filePath: string; text: string }): LintOutput,
}

// TODO: Support config, configPath, modulePath, etc
export type LinterFactory = () => LinterAdapter;

export const linterMap = new Map<string, LinterFactory>();

export function registerLinter(name: string, linterFactory: LinterFactory): void {
  if (linterMap.has(name)) {
    throw new Error(`Linter with name: ${name} already registered.`);
  }

  linterMap.set(name, linterFactory);
}

// XXX: Add more functionality, enable/disable linters?
