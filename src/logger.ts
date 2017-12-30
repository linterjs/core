import getLogger = require("loglevel-colored-level-prefix");

export function getDefaultLogLevel() {
  return process.env.LOG_LEVEL || "warn";
}

export const logger = getLogger({ prefix: "@linter/core" });
