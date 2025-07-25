const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const collections = ['blog']; // TODO: Dynamisch maken

function loadEntry(collection, slug) {
  const filePath = path.join(__dirname, `../../content/${collection}/${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function loadPage(slug) {
  const filePath = path.join(__dirname, `../../content/pages/${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

// Homepage route
router.get('/', (req, res) => {
  const homepage = loadPage('home');
  if (!homepage) return res.status(404).send('Homepage not found');
  res.render('pages', homepage);
});

// Route for pages without parent: /:slug
router.get('/:slug', (req, res, next) => {
  const slug = req.params.slug;

  // Avoid collections routes here
  if (collections.includes(slug)) return next();

  if (slug === 'home') return next();

  const page = loadPage(slug);
  if (!page) return next();

  if (page.parent) {
    return res.redirect(`/${page.parent}/${slug}`);
  }

  res.render('pages', page);
});

// Collection root slug routes (e.g., /blog/:slug)
router.get('/:collection/:slug', (req, res, next) => {
  const { collection, slug } = req.params;

  if (collections.includes(collection)) {
    const entry = loadEntry(collection, slug);
    if (!entry) return res.status(404).send('Not found');
    return res.render(collection, entry);
  }

  next();
});

// Route for pages with parent: /:parent/:slug (combined with collection route above)
router.get('/:parent/:slug', (req, res, next) => {
  const { parent, slug } = req.params;

  if (collections.includes(parent)) {
    // Already handled above, just call next()
    return next();
  }

  const page = loadPage(slug);
  if (!page) return next();

  if (page.parent !== parent) return next();

  res.render('pages', page);
});

module.exports = router;
