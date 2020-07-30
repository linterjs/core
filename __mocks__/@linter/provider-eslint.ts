import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
  LinterFactory,
} from "../../src/linter-adapter";
import { LinterProvider } from "../../src/linter-provider";

const linter: LinterAdapter = {
  format: jest.fn(({ filePath, text }) => ({
    filePath,
    errorCount: 0,
    messages: [],
    output: text,
    warningCount: 0,
  })) as LinterAdapterFormat,
  lint: jest.fn(({ filePath }) => ({
    filePath,
    errorCount: 0,
    messages: [],
    warningCount: 0,
  })) as LinterAdapterLint,
};

const linterFactory: LinterFactory = () => linter;

const linterProvider: LinterProvider = {
  factory: linterFactory,
  name: "eslint",
  supportedExtensions: [".js", "jsx"],
};

export { linter, linterFactory, linterProvider as default };
