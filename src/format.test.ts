import { NoLintersError } from "./errors";
import { format } from "./format";
import { registerLinter } from "./linter-map";
import { LinterFormatInput } from "./linter";

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

  test("Format", async () => {
    const { linter } = require("@linter/eslint");
    const args = { text };
    const result = await format(args);
    expect(result).toMatchSnapshot();
    expect(linter.format).toHaveBeenCalledTimes(1);
    expect(linter.format).toHaveBeenCalledWith(args);
  });

  test("Format with filePath", async () => {
    const { linter } = require("@linter/eslint");
    const args = { filePath, text };
    const result = await format(args);
    expect(result).toMatchSnapshot();
    expect(linter.format).toHaveBeenCalledTimes(2);
    expect(linter.format).toHaveBeenCalledWith(args);
  });

  test("Format with prettier registered", async () => {
    const { linter } = require("@linter/prettier");
    let args: LinterFormatInput = { text };
    let result = await format(args);
    expect(result).toMatchSnapshot();
    expect(linter.format).toHaveBeenCalledTimes(1);
    expect(linter.format).toHaveBeenCalledWith(args);
    args = {
      ...args,
      filePath
    };
    result = await format(args);
    expect(result).toMatchSnapshot();
  });
});
