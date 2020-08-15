const linter = {
  format: jest.fn(({ filePath, text }) => ({
    filePath,
    errorCount: 0,
    messages: [],
    output: text,
    warningCount: 0,
  })),
  lint: jest.fn(({ filePath, text }) => ({
    filePath,
    errorCount: 0,
    messages: [],
    warningCount: 0,
  })),
};

const linterFactory = () => linter;

const linterProvider = {
  factory: linterFactory,
  name: "eslint",
  supportedExtensions: [".js", "jsx"],
};

export { linter, linterFactory, linterProvider as default };
