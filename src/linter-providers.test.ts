import { __clearFiles, __setFiles, readFileSync } from "fs";
import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint
} from "./linter-adapter";
import {
  LinterProvider,
  loadLinterProvidersFromFile,
  registerLinterProvider,
  registeredLinterProvidersFilePath,
  deregisterLinterProvider
} from "./linter-providers";

jest.mock("@linter/eslint");
jest.mock("@linter/prettier");
jest.mock("fs");

beforeAll(() => {
  __setFiles({
    [registeredLinterProvidersFilePath]: ""
  });
});

describe("Register and deregister linter providers", () => {
  test("Register @linter/eslint and @linter/prettier", () => {
    registerLinterProvider("@linter/eslint");
    let fileContent = readFileSync(registeredLinterProvidersFilePath, "utf8");
    expect(fileContent).toMatchSnapshot();
    registerLinterProvider("@linter/prettier");
    fileContent = readFileSync(registeredLinterProvidersFilePath, "utf8");
    expect(fileContent).toMatchSnapshot();
  });

  test("Register @linter/eslint again", () => {
    registerLinterProvider("@linter/eslint");
    const fileContent = readFileSync(registeredLinterProvidersFilePath, "utf8");
    expect(fileContent).toMatchSnapshot();
  });

  test("Deregister @linter/eslint and @linter/prettier", () => {
    deregisterLinterProvider("@linter/eslint");
    let fileContent = readFileSync(registeredLinterProvidersFilePath, "utf8");
    expect(fileContent).toMatchSnapshot();
    deregisterLinterProvider("@linter/prettier");
    fileContent = readFileSync(registeredLinterProvidersFilePath, "utf8");
    expect(fileContent).toMatchSnapshot();
  });
});

describe("Load linter providers", () => {
  test("with no registered linter providers file available", () => {
    __clearFiles();

    expect(() => {
      const linterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();

    __setFiles({
      [registeredLinterProvidersFilePath]: ""
    });
  });

  test("when linter provider module isn't available", () => {
    registerLinterProvider("@linter/non-existent");

    expect(() => {
      const linterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();

    deregisterLinterProvider("@linter/non-existent");
  });

  test("with @linter/eslint registered", () => {
    registerLinterProvider("@linter/eslint");

    const loadedLinterProviders = loadLinterProvidersFromFile();
    expect(loadedLinterProviders).toMatchSnapshot();

    deregisterLinterProvider("@linter/eslint");
  });
});
