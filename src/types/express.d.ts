declare global {
    namespace Express {
        interface Request {
            body: {
                [key: string]: any;
                validated?: (field?: string) => any;
            };
        }
    }
}
