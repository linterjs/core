import { linterMap, LinterAdapter } from "./linter-map";
import { NoLintersError } from "./errors";

export interface FormatInput {
  filePath?: string;
  text: string;
}

export type FormatOutput = string;

export function format(input: FormatInput): FormatOutput {
  if (linterMap.size === 0) {
    throw new NoLintersError();
  }

  const linters: [string, LinterAdapter][] = [];
  for (const [name, linterFactory] of linterMap) {
    if (name === "prettier") {
      linters.unshift([name, linterFactory()]);
    } else {
      linters.push([name, linterFactory()]);
    }
  }

  const { text: formattedText } = linters.reduce(
    ({ filePath, text }, [name, { format }]) => ({
      ...(filePath && { filePath }),
      text: format({ filePath, text })
    }),
    { ...input }
  );

  return formattedText;
}
