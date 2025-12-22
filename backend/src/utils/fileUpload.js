import multer from "multer";

/**
 * Cloudinary-compatible Multer config
 * - Uses memoryStorage
 * - No local file system usage
 * - PDF only
 */
const upload = multer({
  storage: multer.memoryStorage(), // 🔥 REQUIRED FOR CLOUDINARY
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

export default upload;
