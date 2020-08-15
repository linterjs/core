import { vol } from "memfs";
import { loadLinterProvidersFromFile } from "../src/linter-provider";

jest.mock("fs");

afterEach(() => {
  vol.reset();
  jest.resetModules();
});

describe("Load linter providers", () => {
  test("when a package.json can't be found", () => {
    vol.fromJSON({
      "package.json": null,
    });

    expect(() => {
      const linterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();
  });

  test("when an installed linter provider module can't be imported", () => {
    vol.fromJSON({
      "package.json": JSON.stringify({
        devDependencies: { "@linter/provider-nonexistent": "1.0.0" },
      }),
    });

    expect(() => {
      const linterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();
  });

  test("with a linter provider installed", () => {
    vol.fromJSON({
      "package.json": JSON.stringify({
        dependencies: {
          "@linter/provider-eslint": "1.0.0",
        },
      }),
    });

    const eslintLinterProvider = require("@linter/provider-eslint").default;
    const loadedLinterProviders = loadLinterProvidersFromFile();
    expect(loadedLinterProviders).toEqual(new Set([eslintLinterProvider]));
  });

  test("with a linter provider installed and a missing optional linter provider", () => {
    vol.fromJSON({
      "package.json": JSON.stringify({
        devDependencies: { "@linter/provider-eslint": "1.0.0" },
        optionalDependencies: { "@linter/provider-nonexistent": "1.0.0" },
      }),
    });

    const eslintLinterProvider = require("@linter/provider-eslint").default;
    const loadedLinterProviders = loadLinterProvidersFromFile();
    expect(loadedLinterProviders).toEqual(new Set([eslintLinterProvider]));
  });

  test("using all linter provider package naming convensions", () => {
    vol.fromJSON({
      "package.json": JSON.stringify({
        devDependencies: {
          "@linter/provider-eslint": "1.0.0",
          "@zimme/linter-provider-eslint": "1.0.0",
          "linter-provider-eslint": "1.0.0",
        },
      }),
    });

    const eslintLinterProvider = require("linter-provider-eslint").default;
    const loadedLinterProviders = loadLinterProvidersFromFile();
    expect(loadedLinterProviders).toEqual(new Set([eslintLinterProvider]));
  });

  test("when the linter provider package doesn't export a default linter provider", () => {
    vol.fromJSON({
      "package.json": JSON.stringify({
        devDependencies: {
          "linter-provider-not-a-provider": "1.0.0",
        },
      }),
    });

    expect(() => {
      const loadedLinterProviders = loadLinterProvidersFromFile();
    }).toThrowErrorMatchingSnapshot();
  });
});
