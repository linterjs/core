import { NoLintersError } from "./errors";
import { lint } from "./lint";
import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
  registerLinter
} from "./linter-map";

describe("Lint", () => {
  const linterAdapter: LinterAdapter = {
    format: jest.fn<LinterAdapterFormat>(({ text }) => text),
    lint: jest.fn<LinterAdapterLint>(() => ({}))
  };

  test("No registered linters", () => {
    const promise = lint({ text: 'const foo = "bar"' });
    expect(promise).rejects.toBeInstanceOf(NoLintersError);
  });

  test("Lint", async () => {
    registerLinter("testLinter", () => linterAdapter);
    const args = { text: 'const foo = "bar"' };
    const result = await lint(args);
    const isArray = Array.isArray(result);
    expect(isArray).toBeTruthy();
    expect(linterAdapter.lint).toHaveBeenCalledTimes(1);
    expect(linterAdapter.lint).toHaveBeenCalledWith(args);
  });
});
