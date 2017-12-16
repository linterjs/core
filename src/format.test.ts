import { NoLintersError } from "./errors";
import { format } from "./format";
import { LinterAdapter, registerLinter } from "./linter-map";

describe("Format", () => {
  const linterAdapter: LinterAdapter = {
    formatSync: jest.fn(({ text }) => text),
    lintSync: jest.fn(() => ({}))
  };

  const linterFactory = jest.fn(() => linterAdapter);

  test("No registered linters", async () => {
    const promise = format({ text: 'const foo = "bar"' });
    expect(promise).rejects.toBeInstanceOf(NoLintersError);
  });

  test("Format", async () => {
    registerLinter("testLinter", linterFactory);
    const args = { text: 'const foo = "bar"' };
    const result = await format(args);
    expect(result).toBe(args.text);
    expect(linterAdapter.formatSync).toHaveBeenCalledTimes(1);
    expect(linterAdapter.formatSync).toHaveBeenCalledWith(args);
  });
});
