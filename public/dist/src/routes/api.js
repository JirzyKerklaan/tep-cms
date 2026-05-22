"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const entryService_1 = __importDefault(require("../../core/admin/services/entryService"));
const config_1 = __importDefault(require("../../src/config"));
const collectionService_1 = __importDefault(require("../../core/admin/services/collectionService"));
const hasValidToken_1 = require("../../core/middlewares/hasValidToken");
const router = express_1.default.Router();
// -------------------- //
router.use(hasValidToken_1.HasValidToken);
if (!config_1.default.headless_mode) {
    router.get('/*', (req, res) => {
        res.status(420).send({ "error": "headless mode is turned off for this installation, turn it on via your CMS configuration file" });
    });
}
router.get('/collections', async (req, res) => {
    const entries = await collectionService_1.default.getAll();
    res.json({ data: entries });
});
router.get('/:collection', async (req, res) => {
    const entries = await entryService_1.default.getAllFromCollection(req.params.collection);
    res.json({ data: entries });
});
router.get('/:collection/:entry', async (req, res) => {
    const entry = await entryService_1.default.getById(req.params.collection, req.params.entry);
    res.json({ data: entry });
});
// -------------------- //
exports.default = router;
