declare module 'serve-favicon' {
    import { RequestHandler } from 'express';

    function favicon(path: string, options?: object): RequestHandler;

    export default favicon;
}