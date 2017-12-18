import { NoLintersError } from "./errors";
import { format } from "./format";
import { registerLinter } from "./linter-map";

describe("Format", () => {
  const filePath = "test.js";
  const text = 'const foo = "bar"';

  test("No registered linters", async () => {
    try {
      await format({ text });
    } catch (error) {
      expect(error).toBeInstanceOf(NoLintersError);
    }
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

  describe("with Prettier registered", () => {
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
