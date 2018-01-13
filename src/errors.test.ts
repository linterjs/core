import {
  NoLinterProvidersError,
  LinterProviderLoadError,
  ModuleNotLinterProviderError
} from "./errors";

describe("Errors", () => {
  test("LinterProviderLoadError", () => {
    expect(
      new LinterProviderLoadError("@linter/provider-eslint")
    ).toMatchSnapshot();
  });

  test("ModuleNotLinterProviderError", () => {
    expect(
      new ModuleNotLinterProviderError("@linter/provider-eslint")
    ).toMatchSnapshot();
  });

  test("NoLinterProvidersError", () => {
    expect(new NoLinterProvidersError()).toMatchSnapshot();
  });
});
