"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = isAuthenticated;
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
        return;
    }
    res.redirect("/admin/login");
    return;
}
