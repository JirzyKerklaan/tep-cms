"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routes_1 = __importDefault(require("./routes"));
const upload_1 = __importDefault(require("./upload"));
const search_1 = __importDefault(require("./search"));
const admin_1 = __importDefault(require("./admin"));
const api_1 = __importDefault(require("./api"));
const router = (0, express_1.Router)();
router.use('/', routes_1.default);
router.use('/api', api_1.default);
router.use('/admin', admin_1.default);
router.use('/', upload_1.default);
router.use('/', search_1.default);
exports.default = router;
