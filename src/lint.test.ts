import { NoLintersError } from "./errors";
import { lint } from "./lint";
import { registerLinter, LinterAdapter } from "./linter-map";

describe("Lint", () => {
  const linterAdapter: LinterAdapter = {
    format: jest.fn(({ text }) => text),
    lint: jest.fn(() => ({}))
  };

  const linterFactory = jest.fn(() => linterAdapter);

  test("No registered linters", () => {
    expect(() => {
      lint({ text: 'const foo = "bar"' });
    }).toThrowError(NoLintersError);
  });

  test("Lint", () => {
    registerLinter("testLinter", linterFactory);
    const args = { text: 'const foo = "bar"' };
    expect(lint(args)).toBeInstanceOf(Array);
    expect(linterAdapter.lint).toHaveBeenCalledTimes(1);
    expect(linterAdapter.lint).toHaveBeenCalledWith(args);
  });
});
