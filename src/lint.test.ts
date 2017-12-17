import { testLinterProvider, testLinter } from "./__mocks__/adapters";
import { NoLintersError } from "./errors";
import { lint } from "./lint";
import { registerLinter } from "./linter-map";

describe("Lint", () => {
  const text = 'const foo = "bar"';

  test("No registered linters", () => {
    expect(() => lint({ text })).toThrowError(NoLintersError);
  });

  test("Lint", async () => {
    registerLinter(testLinterProvider);
    const args = { text };
    const result = await lint(args);
    expect(result).toMatchSnapshot();
    expect(testLinter.lint).toHaveBeenCalledTimes(1);
    expect(testLinter.lint).toHaveBeenCalledWith(args);
  });
});
