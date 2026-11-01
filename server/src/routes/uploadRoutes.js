const router = require("express").Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { protect, restrictTo } = require("../middleware/auth");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype) ? cb(null, true) : cb(new ApiError(400, "Only JPG, PNG or WebP images are allowed."))),
});

router.post("/", protect, restrictTo("admin"), upload.single("image"), asyncHandler(async (req, res) => {
  const { CLOUDINARY_CLOUD_NAME: cloud_name, CLOUDINARY_API_KEY: api_key, CLOUDINARY_API_SECRET: api_secret } = process.env;
  if (!cloud_name || !api_key || !api_secret) throw new ApiError(503, "Image upload is not set up yet. Paste an image link instead.");
  if (!req.file) throw new ApiError(400, "Choose an image to upload.");
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  const result = await new Promise((resolve, reject) =>
    cloudinary.uploader.upload_stream({ folder: "cabs", transformation: [{ width: 1600, crop: "limit", quality: "auto" }] }, (e, r) => (e ? reject(e) : resolve(r))).end(req.file.buffer));
  res.status(201).json({ url: result.secure_url, publicId: result.public_id });
}));

module.exports = router;
