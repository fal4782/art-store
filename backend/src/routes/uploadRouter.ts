import { Router } from "express";
import crypto from "crypto";
import { authMiddleware, adminMiddleware } from "../middleware.js";

const router = Router();

// Cloudinary folder that artwork photos are uploaded into
const UPLOAD_FOLDER = "artworks";

/**
 * Signs a direct browser-to-Cloudinary upload. The admin form uploads the file
 * straight to Cloudinary with this signature, so photos never pass through
 * this server and the API secret never leaves it. The signature only allows
 * an upload into UPLOAD_FOLDER, and Cloudinary rejects it after an hour.
 */
router.post("/signature", authMiddleware, adminMiddleware, (req, res) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(503).json({ message: "Image uploads aren't configured" });
  }

  const timestamp = Math.round(Date.now() / 1000);
  // Params to sign, sorted alphabetically, as Cloudinary requires
  const toSign = `folder=${UPLOAD_FOLDER}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash("sha1")
    .update(toSign + CLOUDINARY_API_SECRET)
    .digest("hex");

  return res.json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    folder: UPLOAD_FOLDER,
    timestamp,
    signature,
  });
});

export { router as uploadRouter };
