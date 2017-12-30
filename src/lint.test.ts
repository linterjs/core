import { createLint } from "./lint";

jest.mock("@linter/eslint");
jest.mock("@linter/prettier");

describe("Lint", () => {
  let lint;
  let linterAdapterPromiseList;
  const text = 'const foo = "bar"';

  test("with no registered linters", () => {
    lint = createLint(new Set());
    expect(() => lint({ text })).toThrowErrorMatchingSnapshot();
  });

  describe("with @linter/eslint", () => {
    beforeAll(() => {
      const { linterProvider: { linterFactory } } = require("@linter/eslint");
      linterAdapterPromiseList = [Promise.resolve(linterFactory())];
      lint = createLint(new Set(linterAdapterPromiseList));
    });

    test("text only", async () => {
      const { linter } = require("@linter/eslint");
      const args = { text };
      const result = await lint(args);
      expect(result).toMatchSnapshot();
      expect(linter.lint).toHaveBeenCalledTimes(1);
      expect(linter.lint).toHaveBeenCalledWith(args);
    });
  });
});
