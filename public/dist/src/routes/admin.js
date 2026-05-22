"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../core/admin/controllers");
const userService_1 = require("../../core/services/userService");
const errors_1 = require("../utils/errors");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const isAuthenticated_1 = require("../../core/middlewares/isAuthenticated");
const router = express_1.default.Router();
router.get('/login', (req, res) => {
    res.render('admin/login', {
        error: errors_1.ERROR_CODES["TEP200"],
        username: ''
    });
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    await (0, userService_1.loadUsers)();
    const user = (0, userService_1.findUsername)(username);
    if (!user) {
        res.status(401).render('admin/login', {
            error: errors_1.ERROR_CODES["TEP111"],
            username,
        });
        return;
    }
    const passwordValid = await (0, userService_1.verifyPassword)(user, password);
    if (!passwordValid) {
        res.status(401).render('admin/login', {
            error: errors_1.ERROR_CODES["TEP111"],
            username,
        });
        return;
    }
    req.session.user = {
        username: user.username,
        role: user.role
    };
    res.redirect('/admin/');
    return;
});
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});
// -------------------- //
router.get('/register', (req, res) => {
    res.render('admin/register', {
        error: errors_1.ERROR_CODES["TEP200"],
        email: '',
        username: ''
    });
});
router.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    await (0, userService_1.loadUsers)();
    const usernameIsRecognised = (0, userService_1.findUsername)(username);
    const emailIsRecognised = (0, userService_1.findEmail)(email);
    let errorCode = null;
    if (emailIsRecognised) {
        errorCode = 'TEP121';
    }
    else if (usernameIsRecognised) {
        errorCode = 'TEP122';
    }
    if (errorCode) {
        res.status(401).render('admin/register', { error: errors_1.ERROR_CODES[errorCode], username, email });
        return;
    }
    try {
        const userPath = path_1.default.join(process.cwd(), 'content', 'users');
        if (!fs_extra_1.default.existsSync(userPath)) {
            fs_extra_1.default.mkdirSync(userPath, { recursive: true });
        }
        const safeUsername = username
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '');
        const filePath = path_1.default.join(userPath, `${safeUsername}.json`);
        const userData = {
            username: username,
            passwordHash: await (0, userService_1.createPassword)(password),
            role: 'admin',
            email: email
        };
        fs_extra_1.default.writeFileSync(filePath, JSON.stringify(userData, null, 2), 'utf8');
    }
    catch {
        res.status(401).render('admin/register', { error: errors_1.ERROR_CODES["TEP450"] });
        return;
    }
    res.status(401).redirect('/admin/login');
    return;
});
// -------------------- //
router.use(isAuthenticated_1.isAuthenticated);
router.get('/', (req, res) => {
    res.render('admin/dashboard', { layout: 'layouts/admin', user: req.session.user });
});
// --------- Collections ----------- //
router.get('/collections/new', controllers_1.collectionController.newForm);
router.post('/collections/new', controllers_1.collectionController.create);
router.get('/collections/edit/:id', controllers_1.collectionController.editForm);
router.post('/collections/edit/:id', controllers_1.collectionController.update);
router.post('/collections/delete/:id', controllers_1.collectionController.delete);
router.get('/collections', controllers_1.collectionController.list);
// --------- Entries ----------- //
router.get('/collections/:collection/new', controllers_1.entryController.newForm);
router.post('/collections/:collection/new', controllers_1.entryController.create);
router.get('/collections/:collection/edit/:id', controllers_1.entryController.editForm);
router.post('/collections/:collection/edit/:id', controllers_1.entryController.update);
router.post('/collections/:collection/delete/:id', controllers_1.entryController.delete);
router.get('/collections/:collection', controllers_1.entryController.list);
// --------- Blocks ----------- //
router.get('/blocks/new', controllers_1.blockController.newForm);
router.post('/blocks/new', controllers_1.blockController.create);
router.get('/blocks/edit/:id', controllers_1.blockController.editForm);
router.post('/blocks/edit/:id', controllers_1.blockController.update);
router.post('/blocks/delete/:id', controllers_1.blockController.delete);
router.get('/blocks', controllers_1.blockController.list);
// --------- CatchAll ----------- //
router.use('*', (req, res) => {
    res.status(404).render('admin/404', { layout: 'layouts/admin', user: req.session.user });
});
// -------------------- //
exports.default = router;
