// src/requests/useRequest.ts
import { Request, Response, NextFunction } from 'express';
import { BaseRequest } from '../../src/requests/request';

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
        } catch (err: unknown) {
                const error = err as { validation?: unknown }; // Type assertion

                if (error.validation) {
                    res.status(422).json({ errors: error.validation });
                    return;
                }

                res.status(500).json({ errors: 'Validation failed' });
            }
    };
}
