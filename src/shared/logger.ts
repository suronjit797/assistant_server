import colors from "colors/safe";
import config from "../config";
import dayjs from "dayjs";

// Server type (dev/prod)
const SERVER_TYPE = config.NODE_ENV === "production" ? "PROD" : "DEV";

// Timestamp function
const getTimestamp = () => dayjs().format("HH:mm:ss");

// Success Logger
export const successLogger = (message: string) => {
  const logMessage = `[${getTimestamp()}] [${SERVER_TYPE}] ${colors.bold(colors.green("SUCCESS"))}: ${message}`;
  console.log(logMessage);
};

// Error Logger
export const errorLogger = (message: string) => {
  const logMessage = `[${getTimestamp()}] [${SERVER_TYPE}] ${colors.bold(colors.red("ERROR"))}: ${message}`;
  console.log(logMessage);
};

// Info Logger (Optional)
export const infoLogger = (message: string) => {
  const logMessage = `[${getTimestamp()}] [${SERVER_TYPE}] ${colors.bold(colors.blue("INFO"))}: ${message}`;
  console.log(logMessage);
};

// Warning Logger (Optional)
export const warningLogger = (message: string) => {
  const logMessage = `[${getTimestamp()}] [${SERVER_TYPE}] ${colors.bold(colors.yellow("WARNING"))}: ${message}`;
  console.log(logMessage);
};
