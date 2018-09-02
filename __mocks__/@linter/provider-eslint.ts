import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
  LinterFactory
} from "../../src/linter-adapter";
import { LinterProvider } from "../../src/linter-provider";

const linter: LinterAdapter = {
  format: jest.fn<LinterAdapterFormat>(({ filePath, text }) => ({
    errorCount: 0,
    ...(filePath && { filePath }),
    messages: [],
    output: text,
    warningCount: 0
  })),
  lint: jest.fn<LinterAdapterLint>(() => ({
    errorCount: 0,
    messages: [],
    warningCount: 0
  }))
};

const linterFactory: LinterFactory = () => linter;

const linterProvider: LinterProvider = {
  factory: linterFactory,
  name: "eslint"
};

export { linter, linterFactory, linterProvider as default };
