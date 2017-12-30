import { createFormat } from "./format";

jest.mock("@linter/eslint");
jest.mock("@linter/prettier");

describe("Format", () => {
  const filePath = "test.js";
  let format;
  let linterAdapterPromiseList;
  const text = 'const foo = "bar"';

  test("with no registered linters", async () => {
    try {
      format = createFormat(new Set());
      await format({ text });
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  describe("with @linter/eslint", () => {
    beforeAll(() => {
      const { linterProvider: { linterFactory } } = require("@linter/eslint");
      linterAdapterPromiseList = [Promise.resolve(linterFactory())];
      format = createFormat(new Set(linterAdapterPromiseList));
    });

    test("text only", async () => {
      const { linter } = require("@linter/eslint");
      const args = { text };
      const result = await format(args);
      expect(result).toMatchSnapshot();
      expect(linter.format).toHaveBeenCalledTimes(1);
      expect(linter.format).toHaveBeenCalledWith(args);
    });

    test("text and filePath", async () => {
      const { linter } = require("@linter/eslint");
      const args = { filePath, text };
      const result = await format(args);
      expect(result).toMatchSnapshot();
      expect(linter.format).toHaveBeenCalledTimes(2);
      expect(linter.format).toHaveBeenCalledWith(args);
    });

    describe("and @linter/prettier", () => {
      beforeAll(() => {
        const {
          linterProvider: { linterFactory }
        } = require("@linter/prettier");
        linterAdapterPromiseList = [
          Promise.resolve(linterFactory()),
          ...linterAdapterPromiseList
        ];
        format = createFormat(new Set(linterAdapterPromiseList));
      });

      test("Text only", async () => {
        const { linter } = require("@linter/prettier");
        const args = { text };
        const result = await format(args);
        expect(result).toMatchSnapshot();
        expect(linter.format).toHaveBeenCalledTimes(1);
        expect(linter.format).toHaveBeenCalledWith(args);
      });

      test("text and filePath", async () => {
        const { linter } = require("@linter/prettier");
        const args = { text, filePath };
        const result = await format(args);
        expect(result).toMatchSnapshot();
        expect(linter.format).toHaveBeenCalledTimes(2);
        expect(linter.format).toHaveBeenCalledWith(args);
      });
    });
  });
});
