import { createLogger, format, transports } from "winston";
import fs from "fs";
import config from "../config/env";
// Import Functions
const { File, Console } = transports;

// Init Logger
const wintstonLogger = createLogger({
  level: "info",
});

/**
 * For production write to all logs with level info and below
 * to combined.log. Write all logs error (and below) to error.log`.
 * For development, print to the console.
 */
if (config.NODE_ENV === "production") {
  const logDir = "logs";
  // create log folder
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const fileFormat = format.combine(format.timestamp(), format.json());
  const errTransport = new File({
    filename: "./logs/error.log",
    format: fileFormat,
    level: "error",
    handleExceptions: true,
  });
  const infoTransport = new File({
    filename: "./logs/combined.log",
    format: fileFormat,
  });
  wintstonLogger.add(errTransport);
  wintstonLogger.add(infoTransport);
} else {
  // console
  const errorStackFormat = format(info => {
    if (info.stack) {
      return false;
    }
    return info;
  });
  const consoleTransport = new Console({
    format: format.combine(format.colorize(), format.simple(), errorStackFormat()),
  });
  wintstonLogger.add(consoleTransport);
}

// Export logger
export const customLogger = wintstonLogger;
