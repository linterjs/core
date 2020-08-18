import {
  LinterFactory,
  LinterProvider,
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
} from "@linter/core";

const linter: LinterAdapter = {
  format: jest.fn(({ filePath, text }) =>
    Promise.resolve({
      filePath,
      errorCount: 0,
      messages: [],
      output: text,
      warningCount: 0,
    }),
  ) as LinterAdapterFormat,
  lint: jest.fn(({ filePath, text }) =>
    Promise.resolve({
      filePath,
      errorCount: 0,
      messages: [],
      warningCount: 0,
    }),
  ) as LinterAdapterLint,
};

const linterFactory: LinterFactory = () => linter;

const linterProvider: LinterProvider = {
  factory: linterFactory,
  name: "eslint",
  supportedExtensions: [".js", "jsx"],
};

export { linter, linterFactory, linterProvider as default };
