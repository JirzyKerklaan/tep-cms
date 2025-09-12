// src/routes/search.ts
import express from 'express';
import { searchContent, getAllIndex } from '../../core/services/contentIndex';

const router = express.Router();

router.get('/', (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    return res.render('views/search', {
      query: '',
      results: [],
    });
  }

  const results = searchContent(query);

  res.render('views/search', {
    query,
    results,
  });
});

router.get('/api', (req, res) => {
  const query = req.query.q as string;
  const results = searchContent(query);
  res.json(results);
});

export default router;
