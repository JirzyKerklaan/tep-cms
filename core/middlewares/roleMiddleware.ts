import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.session.user;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).render('manager/403', {
                layout: 'layouts/manager',
                user: req.session.user,
                message: 'You do not have permission to access this page.'
            });
        }

        next();
    };
};