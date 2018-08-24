import fs from "jest-plugin-fs";
import Linter from "./linter";

jest.mock("@linter/provider-eslint");
jest.mock("fs", () => require("jest-plugin-fs/mock"));

afterEach(() => {
  fs.restore();
  jest.resetModules();
});

describe("Create Linter", () => {
  test("without any linter providers installed", () => {
    fs.mock({
      "package.json": "{}"
    });

    expect(() => {
      const linter = new Linter();
    }).toThrowErrorMatchingSnapshot();
  });

  test("with a linter provider installed", () => {
    fs.mock({
      "package.json": JSON.stringify({
        devDependencies: {
          "@linter/provider-eslint": "1.0.0"
        }
      })
    });

    const linter = new Linter();
    expect(linter).toBeInstanceOf(Linter);
  });
});
