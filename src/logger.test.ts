import { getDefaultLogLevel } from "./logger";

test("Get default log level", () => {
  expect(getDefaultLogLevel()).toEqual("warn");
});

test("Get log level from environment variable", () => {
  const logLevel = "error";
  process.env.LOG_LEVEL = logLevel;
  expect(getDefaultLogLevel()).toEqual(logLevel);
  process.env.LOG_LEVEL = undefined;
});
