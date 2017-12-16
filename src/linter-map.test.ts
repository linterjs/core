import { DuplicateLinterError } from "./errors";
import {
  linterMap,
  registerLinter,
  LinterAdapter,
  LinterFactory,
  LinterAdapterFormatSync,
  LinterAdapterLintSync
} from "./linter-map";

describe("Linters", () => {
  const linterFactory: LinterFactory = jest.fn<LinterAdapter>(() => ({
    formatSync: jest.fn<LinterAdapterFormatSync>(() => ({})),
    lintSync: jest.fn<LinterAdapterLintSync>(() => ({}))
  }));

  test("Register linter", () => {
    registerLinter("testLinter", linterFactory);
    expect(linterMap.has("testLinter")).toBeTruthy();
  });

  test("Register duplicate linters should fail", () => {
    expect(() => {
      registerLinter("testLinter", linterFactory);
    }).toThrowError(DuplicateLinterError);
  });
});
