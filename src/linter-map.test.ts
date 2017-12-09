import {
  DuplicateLinterError,
  linterMap,
  registerLinter,
  LinterAdapter,
  LinterFactory
} from "./linter-map";

describe("Linters", () => {
  const linterFactory = jest.fn(() => ({
    format: jest.fn(() => ({})),
    lint: jest.fn(() => ({}))
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
