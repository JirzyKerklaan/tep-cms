import { Request, Response, NextFunction } from 'express';
import config from "@root/config";
import {ReasonPhrases, StatusCodes} from "http-status-codes";

/**
 * Middleware to validate the API key.
 * Expects the key in the `Authorization` header as: "Bearer <key>"
 */
export function HasValidToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: ReasonPhrases.UNAUTHORIZED });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: ReasonPhrases.UNAUTHORIZED });
        return;
    }

    const token = parts[1];

    if (token !== config.api.key) {
        res.status(StatusCodes.FORBIDDEN).json({ error: ReasonPhrases.FORBIDDEN });
        return;
    }

    next();
}
