"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasValidToken = HasValidToken;
const config_1 = __importDefault(require("../../src/config"));
const errors_1 = require("../../src/utils/errors");
/**
 * Middleware to validate the API key.
 * Expects the key in the `Authorization` header as: "Bearer <key>"
 */
function HasValidToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ error: errors_1.ERROR_CODES.TEP115 });
        return;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: errors_1.ERROR_CODES.TEP116 });
        return;
    }
    const token = parts[1];
    if (token !== config_1.default.api.key) {
        res.status(403).json({ error: errors_1.ERROR_CODES.TEP117 });
        return;
    }
    next();
}
