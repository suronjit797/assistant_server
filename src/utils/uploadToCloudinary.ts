import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ivis3/ubb",
    transformation: [{ width: 1024 }, { quality: "auto:eco" }, { fetch_format: "webp" }],
  } as Record<string, any>,
});

export const uploadCloudinary = multer({ storage });
