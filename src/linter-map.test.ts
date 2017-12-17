import { DuplicateLinterError } from "./errors";
import { Linter, LinterFormat, LinterLint } from "./linter";
import { LinterFactory, linterMap, registerLinter } from "./linter-map";
import { testLinterProvider } from "./__mocks__/adapters";

describe("Linters", () => {
  const linterFactory: LinterFactory = jest.fn<Linter>(() => ({
    format: jest.fn<LinterFormat>(() => ({})),
    lint: jest.fn<LinterLint>(() => ({}))
  }));

  test("Register linter", () => {
    registerLinter(testLinterProvider);
    expect(linterMap.has("test")).toBeTruthy();
  });

  test("Register duplicate linters should fail", () => {
    expect(() => {
      registerLinter(testLinterProvider);
    }).toThrowError(DuplicateLinterError);
  });
});
