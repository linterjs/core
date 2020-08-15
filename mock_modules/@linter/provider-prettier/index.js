const linter = {
  format: jest.fn(({ filePath, text }) =>
    Promise.resolve({
      filePath,
      errorCount: 0,
      messages: [],
      output: `prettier:${text}`,
      warningCount: 0,
    }),
  ),
  lint: jest.fn(({ filePath }) =>
    Promise.resolve({
      filePath,
      errorCount: 0,
      messages: [],
      warningCount: 0,
    }),
  ),
};

const linterFactory = () => linter;

const linterProvider = {
  factory: linterFactory,
  name: "prettier",
  supportedExtensions: ["js", "jsx"],
};

export { linter, linterFactory, linterProvider as default };
