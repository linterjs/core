import { NoLintersError } from "./errors";
import { lint } from "./lint";
import { registerLinter } from "./linter-map";

describe("Lint", () => {
  const text = 'const foo = "bar"';

  test("No registered linters", () => {
    expect(() => lint({ text })).toThrowError(NoLintersError);
  });

  test("Lint", async () => {
    const { linter } = require("@linter/eslint");
    const args = { text };
    const result = await lint(args);
    expect(result).toMatchSnapshot();
    expect(linter.lint).toHaveBeenCalledTimes(1);
    expect(linter.lint).toHaveBeenCalledWith(args);
  });
});
