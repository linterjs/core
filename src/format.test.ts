import { NoLintersError } from "./errors";
import { format } from "./format";
import { LinterAdapter, registerLinter } from "./linter-map";

describe("Format", () => {
  const linterAdapter: LinterAdapter = {
    format: jest.fn(({ text }) => text),
    lint: jest.fn(() => ({}))
  };

  const linterFactory = jest.fn(() => linterAdapter);

  test("No registered linters", () => {
    expect(() => {
      format({ text: 'const foo = "bar"' });
    }).toThrowError(NoLintersError);
  });

  test("Format", () => {
    registerLinter("testLinter", linterFactory);
    const args = { text: 'const foo = "bar"' };
    expect(format(args)).toBe(args.text);
    expect(linterAdapter.format).toHaveBeenCalledTimes(1);
    expect(linterAdapter.format).toHaveBeenCalledWith(args);
  });
});
