// middleware/handleRedirects.ts
import { Request, Response, NextFunction } from 'express';
import { Redirect } from "../interfaces/Redirect";

const redirects: Redirect[] = [
    // read from file
];

/**
 * Middleware to handle URL redirects
 */
export function handleRedirects(req: Request, res: Response, next: NextFunction) {
    const path = req.path.replace(/\/$/, "");

    const redirect = redirects.find(r => r.oldSlug === path);

    if (redirect) {
        return res.redirect(redirect.type, redirect.newSlug);
    }

    next();
}
