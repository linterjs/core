import { createFormat } from "./format";

jest.mock("@linter/provider-eslint");
jest.mock("@linter/provider-prettier");

describe("Format", () => {
  const filePath = "test.js";
  let format;
  let linterAdapterPromiseList;
  const text = 'const foo = "bar"';

  test("with no installed linter providers", async () => {
    try {
      format = createFormat(new Set());
      await format({ text });
    } catch (error) {
      expect(error).toMatchSnapshot();
    }
  });

  describe("with @linter/provider-eslint", () => {
    beforeAll(() => {
      const { linterFactory } = require("@linter/provider-eslint").default;
      linterAdapterPromiseList = [Promise.resolve(linterFactory())];
      format = createFormat(new Set(linterAdapterPromiseList));
    });

    test("text only", async () => {
      const { linter } = require("@linter/provider-eslint");
      const args = { text };
      const result = await format(args);
      expect(result).toMatchSnapshot();
      expect(linter.format).toHaveBeenCalledTimes(1);
      expect(linter.format).toHaveBeenCalledWith(args);
    });

    test("text and filePath", async () => {
      const { linter } = require("@linter/provider-eslint");
      const args = { filePath, text };
      const result = await format(args);
      expect(result).toMatchSnapshot();
      expect(linter.format).toHaveBeenCalledTimes(2);
      expect(linter.format).toHaveBeenCalledWith(args);
    });

    describe("and @linter/prettier", () => {
      beforeAll(() => {
        const { linterFactory } = require("@linter/provider-prettier").default;
        linterAdapterPromiseList = [
          Promise.resolve(linterFactory()),
          ...linterAdapterPromiseList
        ];
        format = createFormat(new Set(linterAdapterPromiseList));
      });

      test("Text only", async () => {
        const { linter } = require("@linter/provider-prettier");
        const args = { text };
        const result = await format(args);
        expect(result).toMatchSnapshot();
        expect(linter.format).toHaveBeenCalledTimes(1);
        expect(linter.format).toHaveBeenCalledWith(args);
      });

      test("text and filePath", async () => {
        const { linter } = require("@linter/provider-prettier");
        const args = { text, filePath };
        const result = await format(args);
        expect(result).toMatchSnapshot();
        expect(linter.format).toHaveBeenCalledTimes(2);
        expect(linter.format).toHaveBeenCalledWith(args);
      });
    });
  });
});
