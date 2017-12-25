import { DuplicateLinterError } from "./errors";
import { Linter, LinterFormat, LinterLint } from "./linter";
import {
  LinterFactory,
  linterMap,
  LinterProvider,
  registerLinter,
  deregisterLinter
} from "./linter-map";

describe("Linters", () => {
  const linter: Linter = {
    format: jest.fn<LinterFormat>(({ filePath, text }) => ({
      errorCount: 0,
      ...(filePath && { filePath }),
      messages: [],
      output: text,
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
    name: "test"
  };

  const linterFactory: LinterFactory = jest.fn<Linter>(() => ({
    format: jest.fn<LinterFormat>(() => ({})),
    lint: jest.fn<LinterLint>(() => ({}))
  }));

  test("Register linter", () => {
    registerLinter(linterProvider);
    expect(linterMap.has("test")).toBeTruthy();
  });

  test("Register duplicate linters should fail", () => {
    expect(() => {
      registerLinter(linterProvider);
    }).toThrowError(DuplicateLinterError);
  });

  test("Deregister linter", () => {
    deregisterLinter(linterProvider.name);
    expect(linterMap.has("test")).toBeFalsy();
  });
});
