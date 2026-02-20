// middleware/HasValidToken.ts
import { Request, Response, NextFunction } from 'express';
import config from '../../src/config';
import {ERROR_CODES} from "../../src/utils/errors";

/**
 * Middleware to validate the API key.
 * Expects the key in the `Authorization` header as: "Bearer <key>"
 */
export function HasValidToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        res.status(401).json({ error: ERROR_CODES.TEP115 });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(401).json({ error: ERROR_CODES.TEP116 });
        return;
    }

    const token = parts[1];

    if (token !== config.api.key) {
        res.status(403).json({ error: ERROR_CODES.TEP117 });
        return;
    }

    next();
}
