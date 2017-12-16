import {
  linterMap,
  LinterAdapter,
  LinterAdapterFormatAsync,
  LinterAdapterFormatSync
} from "./linter-map";
import { NoLintersError } from "./errors";

export interface FormatInput {
  filePath?: string;
  text: string;
}

export type FormatOutput = string;

function hasSyncFormat(
  linter: LinterAdapterFormatAsync | LinterAdapterFormatSync
): linter is LinterAdapterFormatSync {
  return (<LinterAdapterFormatSync>linter).formatSync !== undefined;
}

export async function format(input: FormatInput): Promise<FormatOutput> {
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

  const { text: formattedText } = await linters.reduce(
    async (output, [name, linter]) => {
      const { filePath, text } = await output;
      return {
        ...(filePath && { filePath }),
        text: hasSyncFormat(linter)
          ? linter.formatSync({ filePath, text })
          : await linter.format({ filePath, text })
      };
    },
    Promise.resolve({ ...input })
  );

  return formattedText;
}
