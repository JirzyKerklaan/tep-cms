// src/requests/useRequest.ts
import { Request, Response, NextFunction } from 'express';
import { BaseRequest } from '../../requests/request';

export function useRequest<T extends BaseRequest>(RequestClass: new () => T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const instance = new RequestClass();
            instance.validate(req.body);

            const validatedData = instance.validated();

            req.body = {
                ...validatedData,
                validated: (field?: string) => instance.validated(field),
            };

            next();
        } catch (err: any) {
            if (err.validation) {
                return res.status(422).json({ errors: err.validation });
            }
            res.status(500).json({ errors: 'Validation failed' });
        }
    };
}
