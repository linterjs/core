declare module "loglevel-colored-level-prefix" {
  import { Logger, LogLevelDesc } from "loglevel";

  namespace log {
    export interface LoggerOptions {
      level?: LogLevelDesc;
      prefix?: string;
    }
  }
  function getLogger(options?: log.LoggerOptions): Logger;
  export = getLogger;
}
