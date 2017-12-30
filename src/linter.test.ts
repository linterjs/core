import { __clearFiles, __setFiles } from "fs";
import { Linter } from "./linter";
import {
  registerLinterProvider,
  registeredLinterProvidersFilePath
} from "./linter-providers";

jest.mock("@linter/eslint");
jest.mock("fs");

beforeAll(() => {
  __setFiles({
    [registeredLinterProvidersFilePath]: ""
  });
});

describe("Create Linter", () => {
  test("without registered linter providers", () => {
    expect(() => {
      const linter = new Linter();
    }).toThrowErrorMatchingSnapshot();
  });

  test("with @linter/eslint registered", () => {
    registerLinterProvider("@linter/eslint");
    const linter = new Linter();
    expect(linter).toBeInstanceOf(Linter);
  });
});
