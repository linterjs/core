import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
  LinterFactory,
} from "../../../src/linter-adapter";
import { LinterProvider } from "../../../src/linter-provider";

const linter: LinterAdapter = {
  format: jest.fn<LinterAdapterFormat>(({ filePath, text }) =>
    Promise.resolve({
      filePath,
      errorCount: 0,
      messages: [],
      output: `prettier:${text}`,
      warningCount: 0,
    }),
  ),
  lint: jest.fn<LinterAdapterLint>(() =>
    Promise.resolve({
      errorCount: 0,
      messages: [],
      warningCount: 0,
    }),
  ),
};

const linterFactory: LinterFactory = () => linter;

const linterProvider: LinterProvider = {
  factory: linterFactory,
  name: "prettier",
  supportedExtensions: ["js", "jsx"],
};

export { linter, linterFactory, linterProvider as default };
