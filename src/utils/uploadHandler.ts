// src/utils/uploadHandler.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

const uploadPath = path.join(process.cwd(), 'public/assets/uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

function getAvailableFilename(destination: string, originalName: string, ext: string): string {
  let filename = `${originalName}${ext}`;
  let counter = 1;

  while (fs.existsSync(path.join(destination, filename))) {
    filename = `${originalName} (${counter})${ext}`;
    counter++;
  }

  return filename;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const finalName = getAvailableFilename(uploadPath, originalName, ext);
    cb(null, finalName);
  },
});

export const upload = multer({ storage });

export async function convertToWebp(filePath: string): Promise<string> {
  const { name } = path.parse(filePath);
  const webpPath = path.join(path.dirname(filePath), `${name}.webp`);

  await sharp(filePath)
    .webp({ quality: 80 })
    .toFile(webpPath);

  return webpPath;
}
