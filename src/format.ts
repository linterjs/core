import { NoLintersError } from "./errors";
import { LintOutput } from "./lint";
import { LinterAdapter } from "./linter-adapter";

export interface FormatInput {
  filePath?: string;
  text: string;
}

export interface FormatOutput extends LintOutput {
  output: string;
}

export type FormatFunction = (
  { filePath, text }: FormatInput
) => Promise<FormatOutput>;

export function createFormat(
  linterAdapterPromises: Set<Promise<LinterAdapter>>
): FormatFunction {
  return async function format({
    filePath: inputFilePath,
    text: inputText
  }: FormatInput): Promise<FormatOutput> {
    if (linterAdapterPromises.size === 0) {
      throw new NoLintersError();
    }

    const defaultResult: FormatOutput = {
      errorCount: 0,
      ...(inputFilePath && { filePath: inputFilePath }),
      messages: [],
      output: inputText,
      warningCount: 0
    };

    return [...linterAdapterPromises.values()].reduce(
      async (accumulatorPromise, linterAdapterPromise) => {
        const accumulator = await accumulatorPromise;
        const { format } = await linterAdapterPromise;

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
  };
}
