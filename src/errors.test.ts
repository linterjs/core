import { DuplicateLinterError, NoLintersError } from "./errors";

describe("Errors", () => {
  test("DuplicateLinterError", () => {
    expect(() => {
      throw new DuplicateLinterError("testLinter");
    }).toThrowError('Linter "testLinter" is already registered.');
  });

  test("NoLintersError", () => {
    expect(() => {
      throw new NoLintersError();
    }).toThrowError(
      "No linters registered. Please install a linter adapter package."
    );
  });
});
