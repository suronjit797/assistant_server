import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../app";
import connectDB from "../config/db";

let isConnected = false;

// Export as Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    app(req, res);
  } catch (error) {
    console.log(error);
  }
}
