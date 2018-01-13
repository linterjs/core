import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint
} from "../../src/linter-adapter";
import { LinterProvider } from "../../src/linter-provider";

export const linter: LinterAdapter = {
  format: jest.fn<LinterAdapterFormat>(({ filePath, text }) => ({
    errorCount: 0,
    ...(filePath && { filePath }),
    messages: [],
    output: `prettier:${text}`,
    warningCount: 0
  })),
  lint: jest.fn<LinterAdapterLint>(() => ({
    errorCount: 0,
    messages: [],
    warningCount: 0
  }))
};

const linterProvider: LinterProvider = {
  linterFactory: () => linter,
  name: "prettier"
};

export default linterProvider;
