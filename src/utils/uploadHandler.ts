// src/utils/uploadHandler.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const uploadPath = path.join(process.cwd(), 'public/assets/uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${originalName}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({ storage });

/**
 * Converts a given image file to .webp format.
 * @param filePath Absolute path to the original file.
 * @returns The path to the generated .webp file.
 */
export async function convertToWebp(filePath: string): Promise<string> {
  const { name } = path.parse(filePath); // Extract filename without extension
  const webpPath = path.join(path.dirname(filePath), `${name}.webp`);

  await sharp(filePath)
    .webp({ quality: 80 })
    .toFile(webpPath);

  return webpPath;
}
