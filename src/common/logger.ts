import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  level: "info", // Adjust level as needed (e.g., "debug", "warn")
  format: format.combine(
    format.timestamp(),
    format.json(), // Logs in JSON format for structured logging
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/app.log" }), // Log to file
  ],
});
