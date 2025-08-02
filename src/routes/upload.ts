// src/routes/uploadRoutes.ts
import express from 'express';
import { upload, convertToWebp } from '../utils/uploadHandler';
import config from '../config';

const router = express.Router();

router.post('/upload', upload.array('images'), async (req, res) => {
  const files = req.files as Express.Multer.File[];

  try {
    if (config.convertToWebp == false) {
      res.redirect('/')
    } else {
      const webpConversions = await Promise.all(
        files.map(file => convertToWebp(file.path))
      );
      res.redirect('/');
    }
  } catch (error) {
    console.error('WebP conversion failed:', error);
    res.status(500).json({ success: false, error: 'Conversion failed' });
  }
});

export default router;
