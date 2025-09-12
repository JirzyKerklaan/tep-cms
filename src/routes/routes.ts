import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { IndexEntry, searchContent } from '../services/contentIndex';

const router = express.Router();

const collectionsDir = path.join(process.cwd(), 'content', 'collections');

const allDirs = fs.readdirSync(collectionsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const collections = allDirs.filter(name => name !== 'pages');

interface Page {
  parent?: string;
  [key: string]: any;
}

interface Entry {
  [key: string]: any;
}

function loadEntry(collection: string, slug: string): Entry | null {
  const filePath = path.join(process.cwd(), `/content/collections/${collection}/${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function loadPage(slug: string): Page | null {
  const filePath = path.join(process.cwd(), `/content/collections/pages/${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

router.get('/', (req, res) => {
  const homepage = loadPage('home');
  if (!homepage) return res.status(404).send('Homepage not found');

  const viewsDir = req.app.get('views');
  const viewsPath = Array.isArray(viewsDir) ? viewsDir[0] : viewsDir;

  let viewToRender = 'standard';

  if (homepage.template) {
    const templatePath = path.join(viewsPath, `views/${homepage.template}.ejs`);
    if (fs.existsSync(templatePath)) {
      viewToRender = homepage.template;
    } else {
    }
  }

  res.render(`views/${viewToRender}`, {
    ...homepage,
    navigation: res.locals.navigation,
  });
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
  
  let viewToRender = 'standard';

  if (page.template) {
    const templatePath = path.join(process.cwd(), 'src', 'templates', `views/${page.template}.ejs`);
    if (fs.existsSync(templatePath)) {
      viewToRender = page.template;
    } else {
    }
  }

  if (slug === 'search') {
     const query = (req.query.q as string) || '';
    let results: IndexEntry[] = [];

    if (query) {
      results = searchContent(query);
    }
    
    res.render(`views/${viewToRender}`, {
      ...page,
      query,
      results,
      navigation: res.locals.navigation,
    });
  } else {
    res.render(`views/${viewToRender}`, {
      ...page,
      navigation: res.locals.navigation,
    });
  }
});

router.get('/:collection/:slug', (req: Request, res: Response, next: NextFunction) => {
  const { collection, slug } = req.params;

  if (collections.includes(collection)) {
    const entry = loadEntry(collection, slug);
    if (!entry) return res.status(404).send('Not found');

    const viewsDir = req.app.get('views');
    const viewsPath = Array.isArray(viewsDir) ? viewsDir[0] : viewsDir;

    const collectionViewFile = path.join(viewsPath, `${collection}.ejs`);
    let viewToRender = 'standard';

    if (fs.existsSync(collectionViewFile)) {
      viewToRender = collection;
    }

    return res.render(`views/${viewToRender}`, entry);
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
