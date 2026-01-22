// middleware/handleRedirects.ts
import { Request, Response, NextFunction } from 'express';
import { Redirect } from "../interfaces/Redirect";
import {redirectService} from "../services/redirectService";

export async function handleRedirects(req: Request, res: Response, next: NextFunction) {
    const redirects: Redirect[] =
        await redirectService.getById<Redirect[]>('globals', 'redirects');

    const normalize = (p: string) => p.replace(/\/$/, '');
    const path = normalize(req.originalUrl.split('?')[0]);
    const redirect = redirects.find(r => normalize(r.from) === path);

    if (redirect) {
        return res.redirect(redirect.permanent ? 301 : 302, redirect.to);
    }

    next();
}
