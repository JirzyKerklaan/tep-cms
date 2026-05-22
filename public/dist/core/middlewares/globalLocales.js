"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLocals = globalLocals;
const config_1 = __importDefault(require("../../src/config"));
const navigation_1 = __importDefault(require("../../src/navigation"));
const renderNav_1 = require("../../src/utils/renderNav");
function globalLocals(req, res, next) {
    res.locals.site_name = config_1.default.site.site_name;
    res.locals.title = 'Default title';
    res.locals.navigation = navigation_1.default;
    res.locals.nav = renderNav_1.renderNav;
    next();
}
