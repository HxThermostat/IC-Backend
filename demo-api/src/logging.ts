import { createLogger, format, transports } from "winston";

import { LOG_LEVEL } from "./config";

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  level: LOG_LEVEL,
  transports: [new transports.Console()],
});

export default logger;
