"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNav = renderNav;
const navigation_1 = __importDefault(require("../navigation"));
function renderNav(name) {
    const nav = navigation_1.default[name];
    if (!nav || !Array.isArray(nav.links))
        return '';
    const items = nav.links.map((link) => `<li><a href="${link.url}">${link.label}</a></li>`).join('');
    return `<ul>${items}</ul>`;
}
