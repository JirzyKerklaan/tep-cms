import { Request, Response, NextFunction } from 'express';
import {ReasonPhrases, StatusCodes} from "http-status-codes";

export const roleMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.session.user;

        if (!user || !roles.includes(user.role)) {
            return res.status(StatusCodes.FORBIDDEN).render('admin/403', {
                layout: 'admin/layouts/admin',
                user: req.session.user,
                message: ReasonPhrases.FORBIDDEN,
            });
        }

        next();
    };
};