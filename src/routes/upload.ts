// src/routes/uploadRoutes.ts
import express from 'express';
import { upload, convertToWebp } from '../utils/uploadHandler';
import config from '../config';
import {ERROR_CODES} from "../utils/errors";

const router = express.Router();

router.post('/upload', upload.array('images'), async (req, res) => {
  const files = req.files as Express.Multer.File[];

  try {
    if (!config.convertToWebp) {
      res.redirect('/')
    } else {
      await Promise.all(
        files.map(file => convertToWebp(file.path))
      );
      res.redirect('/');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: ERROR_CODES["TEP431"] });
  }
});

export default router;
