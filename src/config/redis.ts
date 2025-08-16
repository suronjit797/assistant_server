import Redis from "ioredis";
import config from ".";

// export const queueConnection = {
//   host: config.REDIS_HOST,
//   port: config.REDIS_PORT,
// };

const redisConnection = new Redis(config.REDIS_URL, { keyPrefix: config.REDIS_NAME });

redisConnection.on("connect", () => console.log("✅ Redis connected"));
redisConnection.on("error", (err) => console.error("❌ Redis error:", err));

export default redisConnection;
