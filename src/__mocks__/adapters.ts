import { Linter, LinterFormat, LinterLint } from "../linter";
import { LinterProvider } from "../linter-map";

export const testLinter: Linter = {
  format: jest.fn<LinterFormat>(({ text }) => text),
  lint: jest.fn<LinterLint>(() => ({}))
};

export const testLinterProvider: LinterProvider = {
  linterFactory: () => testLinter,
  name: "test"
};

export const prettierLinter: Linter = {
  format: jest.fn<LinterFormat>(({ text }) => `prettier:${text}`),
  lint: jest.fn<LinterLint>(() => ({}))
};

export const prettierLinterProvider: LinterProvider = {
  linterFactory: () => prettierLinter,
  name: "prettier"
};
