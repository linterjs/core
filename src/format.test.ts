import { linterAdapter, prettierLinterAdapter } from "./__mocks__/adapters";
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
    registerLinter("testLinter", () => linterAdapter);
    const args = { text };
    const result = await format(args);
    expect(result).toMatchSnapshot();
    expect(linterAdapter.format).toHaveBeenCalledTimes(1);
    expect(linterAdapter.format).toHaveBeenCalledWith(args);
  });

  test("Format with filePath", async () => {
    const args = { filePath, text };
    const result = await format(args);
    expect(result).toMatchSnapshot();
  });

  test("Format with prettier registered", async () => {
    registerLinter("prettier", () => prettierLinterAdapter);
    const result = await format({ text });
    expect(result).toMatchSnapshot();
  });
});
