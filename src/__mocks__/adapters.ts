import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint
} from "../linter-map";

export const linterAdapter: LinterAdapter = {
  format: jest.fn<LinterAdapterFormat>(({ text }) => text),
  lint: jest.fn<LinterAdapterLint>(() => ({}))
};

export const prettierLinterAdapter: LinterAdapter = {
  format: jest.fn<LinterAdapterFormat>(({ text }) => `prettier:${text}`),
  lint: jest.fn<LinterAdapterLint>(() => ({}))
};
