"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRedirects = handleRedirects;
const redirectService_1 = require("../services/redirectService");
async function handleRedirects(req, res, next) {
    const redirects = await redirectService_1.redirectService.getById('globals', 'redirects');
    const normalize = (p) => p.replace(/\/$/, '');
    const path = normalize(req.originalUrl.split('?')[0]);
    const redirect = redirects.find(r => normalize(r.from) === path);
    if (redirect) {
        res.redirect(redirect.permanent ? 301 : 302, redirect.to);
        return;
    }
    next();
}
