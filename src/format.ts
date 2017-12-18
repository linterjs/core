import { NoLintersError } from "./errors";
import { LintOutput } from "./lint";
import { Linter } from "./linter";
import { linterMap } from "./linter-map";

export interface FormatInput {
  filePath?: string;
  text: string;
}

export type FormatOutput = LintOutput & {
  output: string;
};

export async function format({
  filePath: inputFilePath,
  text: inputText
}: FormatInput): Promise<FormatOutput> {
  if (linterMap.size === 0) {
    throw new NoLintersError();
  }

  const defaultResult: FormatOutput = {
    errorCount: 0,
    ...(inputFilePath && { filePath: inputFilePath }),
    messages: [],
    output: inputText,
    warningCount: 0
  };

  return [...linterMap.values()].reduce(
    async (accumulatorPromise, linterFactory) => {
      const accumulator = await accumulatorPromise;
      const { format } = await linterFactory();

      let {
        errorCount,
        filePath,
        messages,
        output,
        warningCount
      } = await format({
        filePath: accumulator.filePath,
        text: accumulator.output
      });

      accumulator.errorCount += errorCount;
      if (filePath) {
        accumulator.filePath = filePath;
      }
      accumulator.messages.concat(messages);
      accumulator.output = output;
      accumulator.warningCount += warningCount;

      return accumulator;
    },
    Promise.resolve(defaultResult)
  );
}
