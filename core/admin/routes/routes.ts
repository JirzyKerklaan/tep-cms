import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import {IndexEntry} from "@core/interfaces/IndexEntry";
import { searchContent } from '@core/services/contentIndex';
import { Page } from '@core/interfaces/Page';
import { Entry } from '@core/interfaces/Entry';
import {handleRedirects} from "@core/admin/middlewares/handleRedirects";
import {contentRegistry} from "@core/content/contentRegistry";
import {CollectionEntryRequest} from "@core/requests/routes/collectionEntryRequest";
import {EntryRequest} from "@core/requests/routes/entryRequest";

const router = express.Router();
router.use(handleRedirects);

const collectionsDir = path.join(process.cwd(), 'src', 'content', 'collections');

const allDirs = fs.readdirSync(collectionsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const collections = allDirs.filter(name => name !== 'pages');

function loadEntry(collection: string, slug: string): Entry | null {
  const id = contentRegistry.getBySlug(slug);
  const filePath = path.join(process.cwd(), `/src/content/collections/${collection}/${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Entry;
}

function loadPage(slug: string): Page | null {
  const id = contentRegistry.getBySlug(slug);
  const filePath = path.join(process.cwd(), `/src/content/collections/pages/${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Page;
}

router.get('/', (req, res) => {
  const homepage = loadPage('home');
  if (!homepage) {
    res.status(404).render('views/404');
    return;
  }

  const viewsPath: string = resolveViewsPath(req.app.get('views') as string | string[]);
  let viewToRender = 'standard';

  if (homepage.template) {
    const templatePath = path.join(viewsPath, `views/${homepage.template}.twig`);
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


router.get('/:slug', (req: Request<EntryRequest>, res: Response, next: NextFunction) => {
  const { slug } = req.params;

  if (collections.includes((slug))) {
    next();
    return;
  }

  if (slug === 'home') {
    next();
    return;
  }

  const page = loadPage((slug));
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
    const templatePath = path.join(process.cwd(), 'src', 'templates', `views/${page.template}.twig`);
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

router.get('/:collection/:slug', (req: Request<CollectionEntryRequest>, res: Response, next: NextFunction) => {
  const { collection, slug } = req.params;

  if (collections.includes((collection))) {
    const entry = loadEntry((collection), (slug));
    if (!entry) {
      res.status(404).send('Not found');
      return;
    }

    const viewsPath: string = resolveViewsPath(req.app.get('views') as string | string[]);

    const collectionViewFile = path.join(viewsPath, `${collection}.twig`);
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

  if (collections.includes((parent as string))) {
    next();
    return;
  }

  const page = loadPage((slug as string));
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

function resolveViewsPath(viewsDir: string|string[]): string {
  const viewsPath = Array.isArray(viewsDir)
      ? viewsDir[0]
      : viewsDir;

  if (!viewsPath) {
    throw new Error('Express views directory is not configured');
  }

  return viewsPath;
}
export default router;
