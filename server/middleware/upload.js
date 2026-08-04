import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const hasCloudinary = () =>
  !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

export async function saveImage(file) {
  if (hasCloudinary()) {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      { folder: 'anime-portfolio' }
    );
    return { url: result.secure_url, publicId: result.public_id };
  }
  const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
  const name = `${crypto.randomUUID()}${ext}`;
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), file.buffer);
  return { url: `/uploads/${name}`, publicId: '' };
}

export function deleteImage(publicId) {
  if (publicId && hasCloudinary()) {
    cloudinary.uploader.destroy(publicId).catch(() => {});
  }
}

export function deleteLocalImage(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');
  const file = path.join(dir, path.basename(url));
  fs.rm(file, { force: true }, () => {});
}
