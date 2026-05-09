import chalk from "chalk";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";



class Logger {
  private readonly logger: winston.Logger;
  constructor(logFilePath = "logs/") {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message }: any) => {
            const formattedMessage = `${timestamp} [${level}]: ${message}`;
            return level === "error"
              ? chalk.red(formattedMessage)
              : level === "warn"
                ? chalk.yellow(formattedMessage)
                : level === "info"
                  ? chalk.green(formattedMessage)
                  : level === "debug"
                    ? chalk.blue(formattedMessage)
                    : formattedMessage;
          },
        ),
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: `${logFilePath}/app-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
        }),
        new DailyRotateFile({
          filename: `${logFilePath}/error-%DATE%.log`,
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          level: "error",
          maxFiles: "14d",
        }),
      ],
    });
  }

  private formatArg(arg: any): string {
    return JSON.stringify(arg);
  }

  public info(...args: any[]) {
    const message = args.map(this.formatArg).join(" ");
    this.logger.info(message);
  }

  public warn(...args: any[]) {
    const message = args.map(this.formatArg).join(" ");
    this.logger.warn(message);
  }

  public error(...args: any[]) {
    const message = args.map(this.formatArg).join(" ");
    this.logger.error(message);
  }

  public debug(...args: any[]) {
    const message = args.map(this.formatArg).join(" ");
    this.logger.debug(message);
  }
}
const logger = new Logger();
export default logger;
