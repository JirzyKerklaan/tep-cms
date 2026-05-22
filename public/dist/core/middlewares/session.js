"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = void 0;
const express_session_1 = __importDefault(require("express-session"));
const config_1 = __importDefault(require("../../src/config"));
exports.sessionMiddleware = (0, express_session_1.default)({
    secret: config_1.default.session.secret,
    resave: false,
    saveUninitialized: false,
});
