import { createLint } from "./lint";

jest.mock("@linter/provider-eslint");

describe("Lint", () => {
  const filePath = "test.js";
  let lint;
  let linterAdapterPromiseList;
  const text = 'const foo = "bar"';

  test("with no installed linter providers", () => {
    lint = createLint(new Set());
    expect(() => lint({ text })).toThrowErrorMatchingSnapshot();
  });

  describe("with @linter/provider-eslint", () => {
    beforeAll(() => {
      const { linterFactory } = require("@linter/provider-eslint").default;
      linterAdapterPromiseList = [Promise.resolve(linterFactory())];
      lint = createLint(new Set(linterAdapterPromiseList));
    });

    test("text only", async () => {
      const { linter } = require("@linter/provider-eslint");
      const args = { text };
      const result = await Promise.all(lint(args));
      expect(result).toMatchSnapshot();
      expect(linter.lint).toHaveBeenCalledTimes(1);
      expect(linter.lint).toHaveBeenCalledWith(args);
    });

    test("text and filePath", async () => {
      const { linter } = require("@linter/provider-eslint");
      const args = { filePath, text };
      const result = await Promise.all(lint(args));
      expect(result).toMatchSnapshot();
      expect(linter.lint).toHaveBeenCalledTimes(2);
      expect(linter.lint).toHaveBeenCalledWith(args);
    });
  });
});
