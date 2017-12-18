import { Linter, LinterFormat, LinterLint } from "../../src/linter";
import { LinterProvider, registerLinter } from "../../src/linter-map";

export const linter: Linter = {
  format: jest.fn<LinterFormat>(({ filePath, text }) => ({
    errorCount: 0,
    ...(filePath && { filePath }),
    messages: [],
    output: `prettier:${text}`,
    warningCount: 0
  })),
  lint: jest.fn<LinterLint>(() => ({
    errorCount: 0,
    messages: [],
    warningCount: 0
  }))
};

const linterProvider: LinterProvider = {
  linterFactory: () => linter,
  name: "prettier"
};

registerLinter(linterProvider);
