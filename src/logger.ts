import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "warn",
  // defaultMeta: {
  //   prefix: "@linter/core",
  // },
  transports: new transports.Console({
    format: format.simple(),
  }),
});
