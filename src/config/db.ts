import mongoose from "mongoose";
import seedSuperAdmin from "./seedSuperAdmin";
import config from ".";
import { errorLogger, successLogger } from "../shared/logger";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.DB_URI);
    successLogger(`🛢 Database connected on: [${conn.connection.host}] ${config.DB_URI} `);

    // Seed super admin after successful connection
    await seedSuperAdmin();
  } catch (error) {
    errorLogger(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;
