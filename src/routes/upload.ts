// src/routes/uploadRoutes.ts
import express from 'express';
import { upload, convertToWebp } from '../utils/uploadHandler';
import path from 'path';

const router = express.Router();

router.post('/upload', upload.array('images'), async (req, res) => {
  const files = req.files as Express.Multer.File[];

  try {
    const webpConversions = await Promise.all(
      files.map(file => convertToWebp(file.path))
    );

    res.json({
      success: true,
      uploaded: files.map(f => path.basename(f.path)),
      webp: webpConversions.map(p => path.basename(p)),
    });
  } catch (error) {
    console.error('WebP conversion failed:', error);
    res.status(500).json({ success: false, error: 'Conversion failed' });
  }
});

export default router;
