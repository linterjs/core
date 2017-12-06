import { linterMap } from "./linter-map";

export interface FormatInput {
  filePath?: string;
  text: string;
}

export interface FormatOutput {}

export function format({ filePath, text }: FormatInput): FormatOutput {
  // TODO: Format all the things!
  return {};
}
