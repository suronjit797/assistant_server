/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary as any,
  params: async () => ({
    folder: "sk/pa",
    format: "webp", // Recommended to use format here
    transformation: [{ width: 1024, crop: "limit" }, { quality: "auto:eco" }],
  }),
});

export const uploadCloudinary = multer({ storage });
