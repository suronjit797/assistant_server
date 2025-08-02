import dotenv from "dotenv";
import path from "path";
import type { Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  PORT: Number(process.env.PORT) || 4000,
  DB_URI: process.env.DB_URI as string,
  NODE_ENV: process.env.NODE_ENV as string,
  salt_round: Number(process.env.SALT_ROUND),
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
  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME || "Super Admin",

  FRONTEND_BUILD_PATH: process.env.FRONTEND_BUILD_PATH || "../frontend/dist",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  EMAIL_HOST: process.env.EMAIL_HOST || "localhost",
  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASS: process.env.EMAIL_PASS || "",
  CUSTOMER_CARE_EMAIL: process.env.CUSTOMER_CARE_EMAIL || "support@example.com",

  // redis
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_NAME: process.env.REDIS_NAME || "app1",

  // crypto secret:
  CRYPTO_SECRET: (process.env.CRYPTO_SECRET as string) || "",
};
