module.exports = {
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: -10,
    },
  },
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.(j|t)s?(x)", "**/?(*.)(spec|test).(j|t)s?(x)"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
