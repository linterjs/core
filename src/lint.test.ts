import { createLint, LintFunction } from "./lint";
import { LinterAdapter } from "./linter-adapter";

jest.mock("@linter/provider-eslint");

describe("Lint", () => {
  const filePath = "test.js";
  let lint: LintFunction;
  let linterAdapterPromiseList: Promise<LinterAdapter>[];
  const text = 'const foo = "bar"';

  test("with no installed linter providers", () => {
    lint = createLint(new Map());
    expect(() => lint({ filePath, text })).toThrowErrorMatchingSnapshot();
  });

  describe("with @linter/provider-eslint", () => {
    beforeAll(() => {
      const { factory } = require("@linter/provider-eslint").default;
      linterAdapterPromiseList = [Promise.resolve(factory())];
      lint = createLint(new Map([[".js", new Set(linterAdapterPromiseList)]]));
    });

    test("with no linter for file extension", async () => {
      const { linter } = require("@linter/provider-eslint");
      const args = { text, filePath: "foo.ts" };
      const result = await Promise.all(lint(args));
      expect(result).toMatchSnapshot();
      expect(linter.lint).toHaveBeenCalledTimes(0);
    });

    test("text and filePath", async () => {
      const { linter } = require("@linter/provider-eslint");
      const args = { filePath, text };
      const result = await Promise.all(lint(args));
      expect(result).toMatchSnapshot();
      expect(linter.lint).toHaveBeenCalledTimes(1);
      expect(linter.lint).toHaveBeenCalledWith(args);
    });
  });
});
