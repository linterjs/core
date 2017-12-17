import {
  testLinter,
  testLinterProvider,
  prettierLinterProvider
} from "./__mocks__/adapters";
import { NoLintersError } from "./errors";
import { format } from "./format";
import { registerLinter } from "./linter-map";

describe("Format", () => {
  const filePath = "test.js";
  const text = 'const foo = "bar"';

  test("No registered linters", async () => {
    const promise = format({ text });
    expect(promise).rejects.toBeInstanceOf(NoLintersError);
  });

  test("Format", async () => {
    registerLinter(testLinterProvider);
    const args = { text };
    const result = await format(args);
    expect(result).toMatchSnapshot();
    expect(testLinter.format).toHaveBeenCalledTimes(1);
    expect(testLinter.format).toHaveBeenCalledWith(args);
  });

  test("Format with filePath", async () => {
    const args = { filePath, text };
    const result = await format(args);
    expect(result).toMatchSnapshot();
  });

  test("Format with prettier registered", async () => {
    registerLinter(prettierLinterProvider);
    const result = await format({ text });
    expect(result).toMatchSnapshot();
  });
});
