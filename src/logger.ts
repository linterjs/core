import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "warn",
  transports: new transports.Console({
    format: format.combine(
      format.label({ label: "@linter/core", message: true }),
      format.simple(),
    ),
  }),
});
