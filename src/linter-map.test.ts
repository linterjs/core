import { DuplicateLinterError } from "./errors";
import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
  LinterFactory,
  linterMap,
  registerLinter
} from "./linter-map";

describe("Linters", () => {
  const linterFactory: LinterFactory = jest.fn<LinterAdapter>(() => ({
    format: jest.fn<LinterAdapterFormat>(() => ({})),
    lint: jest.fn<LinterAdapterLint>(() => ({}))
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
