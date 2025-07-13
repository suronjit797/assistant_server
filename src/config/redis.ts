import Redis from "ioredis";
import config from ".";

export const queueConnection = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
};

const connection = new Redis({ ...queueConnection, keyPrefix: config.REDIS_NAME });

connection.on("connect", () => console.log("✅ Redis connected"));
connection.on("error", (err) => console.error("❌ Redis error:", err));

export default connection;
