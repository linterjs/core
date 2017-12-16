import { NoLintersError } from "./errors";
import { lint } from "./lint";
import {
  registerLinter,
  LinterAdapter,
  LinterAdapterFormatSync,
  LinterAdapterLintSync
} from "./linter-map";

describe("Lint", () => {
  const linterAdapter: LinterAdapter = {
    formatSync: jest.fn<LinterAdapterFormatSync>(({ text }) => text),
    lintSync: jest.fn<LinterAdapterLintSync>(() => ({}))
  };

  const linterFactory = jest.fn(() => linterAdapter);

  test("No registered linters", () => {
    const promise = lint({ text: 'const foo = "bar"' });
    expect(promise).rejects.toBeInstanceOf(NoLintersError);
  });

  test("Lint", async () => {
    registerLinter("testLinter", linterFactory);
    const args = { text: 'const foo = "bar"' };
    const result = await lint(args);
    const isArray = Array.isArray(result);
    expect(isArray).toBeTruthy();
    expect(linterAdapter.lintSync).toHaveBeenCalledTimes(1);
    expect(linterAdapter.lintSync).toHaveBeenCalledWith(args);
  });
});
