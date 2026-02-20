import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import {IndexEntry} from "../../core/interfaces/IndexEntry";
import { searchContent } from '../../core/services/contentIndex';
import { Page } from '../../core/interfaces/Page';
import { Entry } from '../../core/interfaces/Entry';
import {handleRedirects} from "../../core/middlewares/handleRedirects";

const router = express.Router();
router.use(handleRedirects);

const collectionsDir = path.join(process.cwd(), 'content', 'collections');

const allDirs = fs.readdirSync(collectionsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const collections = allDirs.filter(name => name !== 'pages');

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
  if (!homepage) {
    res.status(404).send('Homepage not found');
    return;
  }

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

  if (collections.includes(<string>slug)) {
    next();
    return;
  }

  if (slug === 'home') {
    next();
    return;
  }

  const page = loadPage(<string>slug);
  if (!page) {
    next();
    return;
  }

  if (page.parent) {
    res.redirect(`/${page.parent}/${slug}`);
    return;
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

  if (collections.includes(<string>collection)) {
    const entry = loadEntry(<string>collection, <string>slug);
    if (!entry) {
      res.status(404).send('Not found');
      return;
    }

    const viewsDir = req.app.get('views');
    const viewsPath = Array.isArray(viewsDir) ? viewsDir[0] : viewsDir;

    const collectionViewFile = path.join(viewsPath, `${collection}.ejs`);
    let viewToRender: string | string[] = 'standard';

    if (fs.existsSync(collectionViewFile)) {
      viewToRender = collection;
    }

    res.render(`views/${viewToRender}`, entry);
    return;
  }

  next();
});

router.get('/:parent/:slug', (req: Request, res: Response, next: NextFunction) => {
  const { parent, slug } = req.params;

  if (collections.includes(<string>parent)) {
    next();
    return;
  }

  const page = loadPage(<string>slug);
  if (!page) {
    next();
    return;
  }

  if (page.parent !== parent) {
    next();
    return;
  }

  res.render('views/pages', page);
});

export default router;
