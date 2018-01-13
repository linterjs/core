import { getDefaultLogLevel } from "./logger";

test("Get default log level", () => {
  const LOG_LEVEL = process.env.LOG_LEVEL;
  process.env.LOG_LEVEL = undefined;

  expect(getDefaultLogLevel()).toEqual("warn");

  process.env.LOG_LEVEL = LOG_LEVEL;
});

test("Get log level from environment variable", () => {
  const logLevel = "error";
  process.env.LOG_LEVEL = logLevel;

  expect(getDefaultLogLevel()).toEqual(logLevel);

  process.env.LOG_LEVEL = undefined;
});
