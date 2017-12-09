module.exports = {
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.(j|t)s?(x)", "**/?(*.)(spec|test).(j|t)s?(x)"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
