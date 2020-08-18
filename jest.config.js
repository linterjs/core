const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: "ts-jest/presets/js-with-babel",
  transformIgnorePatterns: [
    "/node_modules/(?!(@linter/provider-.*|@zimme/linter-provider-.*|linter-provider-.*)/)",
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
};
