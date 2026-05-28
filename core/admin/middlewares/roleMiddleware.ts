import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.session.user;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).render('admin/403', {
                layout: 'admin/layouts/admin',
                user: req.session.user,
                message: 'You do not have permission to access this page.'
            });
        }

        next();
    };
};