import multer from "multer";
import path from "path";
import fs from "fs";

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    let folder = "uploads/others";

    if (req.originalUrl.includes("categories")) {
      folder = "uploads/categories";
    }

    if (req.originalUrl.includes("products")) {
      folder = "uploads/products";
    }

    if (req.originalUrl.includes("users")) {
      folder = "uploads/avatars";
    }

    // auto create folder
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
