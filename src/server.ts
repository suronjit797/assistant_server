/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "http";
import app from "./app";
import config from "./config";

import connectDB from "./config/db";
import { errorLogger, successLogger } from "./shared/logger";

let server: Server;

process.on("uncaughtException", (error) => {
  errorLogger(`uncaughtException: ${error.message}`);
  process.exit(1);
});



const bootFunctions = async () => {
  try {
    if (!config.PORT) return errorLogger("Port is not found");

    // connect mongodb
    await connectDB();

    server = app.listen(config.PORT, () => successLogger(`App listening on port ${config.PORT}...`));
  } catch (error: any) {
    errorLogger(`Error during server startup: ${error?.message}`);
    process.exit(1);
  }
};

bootFunctions();
process.on("uncaughtException", (error) => {
  errorLogger(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  if (server) {
    server.close(() => {
      errorLogger(`Unhandled rejection: ${error}`);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  successLogger("SIGTERM is received");
  if (server) {
    server.close();
  }
});
