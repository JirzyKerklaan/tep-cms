import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import config from '../config';

const router = express.Router();

const collections = ['blog'];

interface Page {
  parent?: string;
  [key: string]: any;
}

interface Entry {
  [key: string]: any;
}

function loadEntry(collection: string, slug: string): Entry | null {
  const filePath = path.join(process.cwd(), `/content/${collection}/${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function loadPage(slug: string): Page | null {
  const filePath = path.join(process.cwd(), `/content/pages/${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}

router.get('/', (req: Request, res: Response) => {
  const homepage = loadPage('home');
  if (!homepage) return res.status(404).send('Homepage not found');
  res.render('views/pages', homepage); // views/pages.hbs
});

router.get('/:slug', (req: Request, res: Response, next: NextFunction) => {
  const slug = req.params.slug;

  if (collections.includes(slug)) return next();

  if (slug === 'home') return next();

  const page = loadPage(slug);
  if (!page) return next();

  if (page.parent) {
    return res.redirect(`/${page.parent}/${slug}`);
  }

  res.render('views/pages', page);
});

router.get('/:collection/:slug', (req: Request, res: Response, next: NextFunction) => {
  const { collection, slug } = req.params;

  if (collections.includes(collection)) {
    const entry = loadEntry(collection, slug);
    if (!entry) return res.status(404).send('Not found');
    return res.render(collection, entry);
  }

  next();
});

router.get('/:parent/:slug', (req: Request, res: Response, next: NextFunction) => {
  const { parent, slug } = req.params;

  if (collections.includes(parent)) {
    return next();
  }

  const page = loadPage(slug);
  if (!page) return next();

  if (page.parent !== parent) return next();

  res.render('views/pages', page);
});

export default router;
