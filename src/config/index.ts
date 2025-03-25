import dotenv from "dotenv";
import path from "path";
import type { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: Number(process.env.PORT) || 4000,
  DB_URI: process.env.DB_URI as string,
  NODE_ENV: process.env.NODE_ENV as string,
  sault_round: Number(process.env.SAULT_ROUND),
  Bearer: (process.env.BEARER as string) || "Bearer",
  token: {
    access_token_time: process.env.ACCESS_TOKEN_TIME as StringValue,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET as Secret,
    refresh_token_time: process.env.REFRESH_TOKEN_TIME as StringValue,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET as Secret,
  },
  // superadmin
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL || "admin@example.com",
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "admin123#",
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
};
