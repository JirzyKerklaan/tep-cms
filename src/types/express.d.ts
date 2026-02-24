declare global {
    namespace Express {
        interface Request {
            body: {
                [key: string]: unknown;
                validated?: (field?: string) => unknown;
            };
        }
    }
}
