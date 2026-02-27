import { Request, Response, NextFunction } from 'express';
import { BaseRequest } from '../../src/requests/request';

export function useRequest<
    TData extends Record<string, unknown>,
    TRequest extends BaseRequest<TData>
>(
    RequestClass: new () => TRequest
) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const instance = new RequestClass();

            instance.validate(req.body as TData);

            const validatedData = instance.validated() as TData;

            req.body = {
                ...validatedData,
                validated: <K extends keyof TData>(field?: K) =>
                    instance.validated(field),
            };

            next();
        } catch (err: unknown) {
            const error = err as { validation?: unknown };

            if (error.validation) {
                res.status(422).json({ errors: error.validation });
                return;
            }

            res.status(500).json({ errors: 'Validation failed' });
        }
    };
}