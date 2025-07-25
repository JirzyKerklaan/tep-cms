"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
const collections = ['blog'];
function loadEntry(collection, slug) {
    const filePath = path_1.default.join(process.cwd(), `/content/${collection}/${slug}.json`);
    if (!fs_1.default.existsSync(filePath))
        return null;
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
}
function loadPage(slug) {
    const filePath = path_1.default.join(process.cwd(), `/content/pages/${slug}.json`);
    console.log('Loading page JSON:', filePath);
    if (!fs_1.default.existsSync(filePath))
        return null;
    const raw = fs_1.default.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
}
router.get('/', (req, res) => {
    const homepage = loadPage('home');
    if (!homepage)
        return res.status(404).send('Homepage not found');
    res.render('pages', homepage);
});
router.get('/:slug', (req, res, next) => {
    const slug = req.params.slug;
    if (collections.includes(slug))
        return next();
    if (slug === 'home')
        return next();
    const page = loadPage(slug);
    if (!page)
        return next();
    if (page.parent) {
        return res.redirect(`/${page.parent}/${slug}`);
    }
    res.render('pages', page);
});
router.get('/:collection/:slug', (req, res, next) => {
    const { collection, slug } = req.params;
    if (collections.includes(collection)) {
        const entry = loadEntry(collection, slug);
        if (!entry)
            return res.status(404).send('Not found');
        return res.render(collection, entry);
    }
    next();
});
router.get('/:parent/:slug', (req, res, next) => {
    const { parent, slug } = req.params;
    if (collections.includes(parent)) {
        return next();
    }
    const page = loadPage(slug);
    if (!page)
        return next();
    if (page.parent !== parent)
        return next();
    res.render('pages', page);
});
exports.default = router;
