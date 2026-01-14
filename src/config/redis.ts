import Redis from "ioredis";
import config from ".";

let hasLoggedError = false;

// export const queueConnection = {
//   host: config.REDIS_HOST,
//   port: config.REDIS_PORT,
// };

// const redisConnection = new Redis(config.REDIS_URL, { keyPrefix: config.REDIS_NAME });

const redisConnection = new Redis(config.REDIS_URL, {
  keyPrefix: config.REDIS_NAME,
  lazyConnect: true,
  retryStrategy(times) {
    // retry with backoff, but don't crash
    return Math.min(times * 200, 2000);
  },
});

redisConnection.on("connect", () => console.log("✅ Redis connected"));
// redisConnection.on("error", (err) => console.error("❌ Redis error:", err));
redisConnection.on("error", (err) => {
  if (!hasLoggedError) {
    console.error("❌ Redis error:", err.message);
    hasLoggedError = true;
  }
  // ignore subsequent errors until reconnect
});

export default redisConnection;
