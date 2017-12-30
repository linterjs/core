import { NoLintersError } from "./errors";

describe("Errors", () => {
  test("NoLintersError", () => {
    expect(new NoLintersError()).toMatchSnapshot();
  });
});
