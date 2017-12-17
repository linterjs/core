import { NoLintersError } from "./errors";
import { LinterAdapter } from "./linter-adapter";
import { linterMap } from "./linter-map";

export interface FormatInput {
  filePath?: string;
  text: string;
}

export type FormatOutput = string;

export async function format(input: FormatInput): Promise<FormatOutput> {
  if (linterMap.size === 0) {
    throw new NoLintersError();
  }

  const linters: [string, LinterAdapter][] = [];
  for (const [name, linterFactory] of linterMap) {
    if (name === "prettier") {
      linters.unshift([name, await linterFactory()]);
    } else {
      linters.push([name, await linterFactory()]);
    }
  }

  const { text: formattedText } = await linters.reduce(
    async (output, [name, linter]) => {
      const { filePath, text } = await output;
      return {
        ...(filePath && { filePath }),
        text: await linter.format({ filePath, text })
      };
    },
    Promise.resolve({ ...input })
  );

  return formattedText;
}
