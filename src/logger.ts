import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: process.env.LOG_LEVEL ?? "warn",
  // defaultMeta: {
  //   prefix: "@linter/core",
  // },
  transports: new transports.Console({
    format: format.simple(),
  }),
});
