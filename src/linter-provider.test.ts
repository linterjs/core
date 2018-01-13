import fs from "jest-plugin-fs";
import {
  LinterAdapter,
  LinterAdapterFormat,
  LinterAdapterLint
} from "./linter-adapter";
import { LinterProvider, loadLinterProvidersFromFile } from "./linter-provider";

jest.mock("@linter/provider-eslint");
jest.mock("@zimme/linter-provider-eslint");
jest.mock("fs", () => require("jest-plugin-fs/mock"));
jest.mock("linter-provider-eslint");

beforeAll(() => {
  fs.root = process.cwd();
});

afterEach(() => {
  fs.restore();
  jest.resetModules();
});

describe("Load linter providers", () => {
  test("when a package.json can't be found", () => {
    fs.mock();

    expect(() => {
      const linterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();
  });

  test("when an installed linter provider module can't be imported", () => {
    fs.mock({
      "package.json": JSON.stringify({
        devDependencies: { "@linter/provider-nonexistent": "1.0.0" }
      })
    });

    expect(() => {
      const linterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();
  });

  test("with a linter provider installed", () => {
    fs.mock({
      "package.json": JSON.stringify({
        dependencies: {
          "@linter/provider-eslint": "1.0.0"
        }
      })
    });

    const eslintLinterProvider = require("@linter/provider-eslint").default;
    const loadedLinterProviders = loadLinterProvidersFromFile();
    expect(loadedLinterProviders).toEqual(new Set([eslintLinterProvider]));
  });

  test("with an installed linter provider and a missing optional linter provider", () => {
    fs.mock({
      "package.json": JSON.stringify({
        devDependencies: { "@linter/provider-eslint": "1.0.0" },
        optionalDependencies: { "@linter/provider-nonexistent": "1.0.0" }
      })
    });

    const eslintLinterProvider = require("@linter/provider-eslint").default;
    const loadedLinterProviders = loadLinterProvidersFromFile();
    expect(loadedLinterProviders).toEqual(new Set([eslintLinterProvider]));
  });

  test("using all linter provider package naming convensions", () => {
    fs.mock({
      "package.json": JSON.stringify({
        devDependencies: {
          "@linter/provider-eslint": "1.0.0",
          "@zimme/linter-provider-eslint": "1.0.0",
          "linter-provider-eslint": "1.0.0"
        }
      })
    });

    const eslintLinterProvider = require("@linter/provider-eslint").default;
    const loadedLinterProviders = loadLinterProvidersFromFile();
    expect(loadedLinterProviders).toEqual(new Set([eslintLinterProvider]));
  });

  test("when the linter provider package doesn't export a default linter provider", () => {
    fs.mock({
      "package.json": JSON.stringify({
        devDependencies: {
          "linter-provider-not-a-provider": "1.0.0"
        }
      })
    });

    expect(() => {
      const loadedLinterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();
  });
});
