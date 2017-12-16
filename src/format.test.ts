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


  test("No registered linters", async () => {
    const promise = format({ text: 'const foo = "bar"' });
    expect(promise).rejects.toBeInstanceOf(NoLintersError);
  });

  test("Format", async () => {
    registerLinter("testLinter", () => linterAdapter);
    const args = { text: 'const foo = "bar"' };
    const result = await format(args);
    expect(result).toEqual(args.text);
    expect(linterAdapter.format).toHaveBeenCalledTimes(1);
    expect(linterAdapter.format).toHaveBeenCalledWith(args);
  });
});
