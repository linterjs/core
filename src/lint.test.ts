import { linterAdapter } from "./__mocks__/adapters";
import { NoLintersError } from "./errors";
import { lint } from "./lint";
import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
  registerLinter
} from "./linter-map";

describe("Lint", () => {
  const text = 'const foo = "bar"';

  test("No registered linters", () => {
    const promise = lint({ text });
    expect(promise).rejects.toBeInstanceOf(NoLintersError);
  });

  test("Lint", async () => {
    registerLinter("testLinter", () => linterAdapter);
    const args = { text };
    const result = await lint(args);
    expect(result).toMatchSnapshot();
    expect(linterAdapter.lint).toHaveBeenCalledTimes(1);
    expect(linterAdapter.lint).toHaveBeenCalledWith(args);
  });
});
