import { extname } from "path";
import { NoLinterProvidersError } from "./errors";
import { LintOutput } from "./lint";
import { LinterAdapter } from "./linter-adapter";
import { logger } from "./logger";

export interface FormatInput {
  filePath: string;
  text: string;
}

export interface FormatOutput extends LintOutput {
  output: string;
}

export type FormatFunction = (
  { filePath, text }: FormatInput,
) => Promise<FormatOutput>;

export function createFormat(
  linterAdapterPromisesBySupportedExtensions: Map<
    string,
    Set<Promise<LinterAdapter>>
  >,
): FormatFunction {
  return async function format({
    filePath: inputFilePath,
    text: inputText,
  }: FormatInput): Promise<FormatOutput> {
    if (linterAdapterPromisesBySupportedExtensions.size === 0) {
      logger.debug("No linter providers found, not formatting.");
      throw new NoLinterProvidersError();
    }

    const defaultResult: FormatOutput = {
      errorCount: 0,
      filePath: inputFilePath,
      messages: [],
      output: inputText,
      warningCount: 0,
    };

    const linterAdapterPromises = linterAdapterPromisesBySupportedExtensions.get(
      extname(inputFilePath),
    );

    if (!linterAdapterPromises || linterAdapterPromises.size === 0) {
      return defaultResult;
    }

    return [...linterAdapterPromises.values()].reduce(
      async (accumulatorPromise, linterAdapterPromise) => {
        const accumulator = await accumulatorPromise;
        const linterAdapter = await linterAdapterPromise;

        const {
          errorCount,
          filePath,
          messages,
          output,
          warningCount,
        } = await linterAdapter.format({
          filePath: accumulator.filePath,
          text: accumulator.output,
        });

        accumulator.errorCount += errorCount;
        accumulator.filePath = filePath;
        accumulator.messages.concat(messages);
        accumulator.output = output;
        accumulator.warningCount += warningCount;

        return accumulator;
      },
      Promise.resolve(defaultResult),
    );
  };
}
