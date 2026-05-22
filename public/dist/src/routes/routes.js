"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const contentIndex_1 = require("../../core/services/contentIndex");
const handleRedirects_1 = require("../../core/middlewares/handleRedirects");
const router = express_1.default.Router();
router.use(handleRedirects_1.handleRedirects);
const collectionsDir = path_1.default.join(process.cwd(), 'content', 'collections');
const allDirs = fs_1.default.readdirSync(collectionsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
const collections = allDirs.filter(name => name !== 'pages');
function loadEntry(collection, slug) {
    const filePath = path_1.default.join(process.cwd(), `/content/collections/${collection}/${slug}.json`);
    if (!fs_1.default.existsSync(filePath))
        return null;
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
}
function loadPage(slug) {
    const filePath = path_1.default.join(process.cwd(), `/content/collections/pages/${slug}.json`);
    if (!fs_1.default.existsSync(filePath))
        return null;
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
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
        const templatePath = path_1.default.join(viewsPath, `views/${homepage.template}.twig`);
        if (fs_1.default.existsSync(templatePath)) {
            viewToRender = homepage.template;
        }
        else {
        }
    }
    res.render(`views/${viewToRender}`, {
        ...homepage,
        navigation: res.locals.navigation,
    });
});
router.get('/:slug', (req, res, next) => {
    const slug = req.params.slug;
    if (collections.includes(slug)) {
        next();
        return;
    }
    if (slug === 'home') {
        next();
        return;
    }
    const page = loadPage(slug);
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
        const templatePath = path_1.default.join(process.cwd(), 'src', 'templates', `views/${page.template}.twig`);
        if (fs_1.default.existsSync(templatePath)) {
            viewToRender = page.template;
        }
        else {
        }
    }
    if (slug === 'search') {
        const query = req.query.q || '';
        let results = [];
        if (query) {
            results = (0, contentIndex_1.searchContent)(query);
        }
        res.render(`views/${viewToRender}`, {
            ...page,
            query,
            results,
            navigation: res.locals.navigation,
        });
    }
    else {
        res.render(`views/${viewToRender}`, {
            ...page,
            navigation: res.locals.navigation,
        });
    }
});
router.get('/:collection/:slug', (req, res, next) => {
    const { collection, slug } = req.params;
    if (collections.includes(collection)) {
        const entry = loadEntry(collection, slug);
        if (!entry) {
            res.status(404).send('Not found');
            return;
        }
        const viewsDir = req.app.get('views');
        const viewsPath = Array.isArray(viewsDir) ? viewsDir[0] : viewsDir;
        const collectionViewFile = path_1.default.join(viewsPath, `${collection}.twig`);
        let viewToRender = 'standard';
        if (fs_1.default.existsSync(collectionViewFile)) {
            viewToRender = collection;
        }
        res.render(`views/${viewToRender}`, entry);
        return;
    }
    next();
});
router.get('/:parent/:slug', (req, res, next) => {
    const { parent, slug } = req.params;
    if (collections.includes(parent)) {
        next();
        return;
    }
    const page = loadPage(slug);
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
exports.default = router;
