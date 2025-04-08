import Redis from "ioredis";
import config from ".";

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
});

redis.on("connect", async () => {
  console.log("✅ Redis connected");
  await redis.config("SET", "maxmemory", "256mb");
  await redis.config("SET", "maxmemory-policy", "allkeys-lfu");
});
redis.on("error", (err) => console.error("❌ Redis error:", err));
redis.on("error", (err) => "");

export default redis;
