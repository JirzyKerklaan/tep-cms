import express from 'express';
import { upload, convertToWebp } from '@core/utils/uploadHandler';
import config from "@root/config";
import {ReasonPhrases, StatusCodes} from "http-status-codes";
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
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, error: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
});

export default router;
