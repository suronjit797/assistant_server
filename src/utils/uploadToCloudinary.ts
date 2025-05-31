import multer from "multer";

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  cloudinary,
  params: async () => ({
    folder: "sk/pa",
    format: "webp", // Recommended to use format here
    transformation: [{ width: 1024, crop: "limit" }, { quality: "auto:eco" }],
  }),
});

export const uploadCloudinary = multer({ storage });
