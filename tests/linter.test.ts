import { vol } from "memfs";
import Linter from "../src/linter";

jest.mock("fs");

afterEach(() => {
  vol.reset();
  jest.resetModules();
});

describe("Create Linter", () => {
  test("without any linter providers installed", () => {
    vol.fromJSON({
      "package.json": "{}",
    });

    expect(() => {
      const linter = new Linter();
    }).toThrowErrorMatchingSnapshot();
  });

  test("without any linter providers installed and a log level set via constructor parameter", () => {
    vol.fromJSON({
      "package.json": "{}",
    });

    expect(() => {
      const linter = new Linter({ logLevel: "debug" });
    }).toThrowErrorMatchingSnapshot();
  });

  test("with a linter provider installed", () => {
    vol.fromJSON({
      "package.json": JSON.stringify({
        devDependencies: {
          "@linter/provider-eslint": "1.0.0",
        },
      }),
    });

    const linter = new Linter();
    expect(linter).toBeInstanceOf(Linter);
  });
});
