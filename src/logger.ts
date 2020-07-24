import getLogger = require("loglevel-colored-level-prefix");
import { LogLevelDesc } from "loglevel";

export function getDefaultLogLevel(): LogLevelDesc {
  return (process.env.LOG_LEVEL as LogLevelDesc | undefined) ?? "warn";
}

export const logger = getLogger({ prefix: "@linter/core" });
