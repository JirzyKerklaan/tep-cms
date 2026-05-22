"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contentIndex_1 = require("../../core/services/contentIndex");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    const query = req.query.q;
    if (!query) {
        res.render('views/search', {
            query: '',
            results: [],
        });
        return;
    }
    const results = (0, contentIndex_1.searchContent)(query);
    res.render('views/search', {
        query,
        results,
    });
});
router.get('/api', (req, res) => {
    const query = req.query.q;
    const results = (0, contentIndex_1.searchContent)(query);
    res.json(results);
});
exports.default = router;
