import { NoLintersError } from "./errors";
import { format } from "./format";
import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint,
  registerLinter
} from "./linter-map";

describe("Format", () => {
  const linterAdapter: LinterAdapter = {
    format: jest.fn<LinterAdapterFormat>(({ text }) => text),
    lint: jest.fn<LinterAdapterLint>(() => ({}))
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
    expect(linterAdapter.format).toHaveBeenCalledTimes(1);
    expect(linterAdapter.format).toHaveBeenCalledWith(args);
  });
});
