import { Request, Response } from 'express';
import {IController} from "@core/interfaces/IController";
import {route} from "@core/utils/namedRoutes";

export abstract class Controller implements IController {
    protected viewFolder: string;
    protected modelName: string;

    constructor(viewFolder: string, modelName: string) {
        this.viewFolder = viewFolder;
        this.modelName = modelName;
    }

    // Abstract methods — must be implemented in subclasses
    abstract list(req: Request, res: Response): Promise<void>;
    abstract create(req: Request, res: Response): Promise<void>;
    abstract edit(req: Request, res: Response): Promise<void>;

    // Rendering & Redirection methods - used in subclasses
    protected render(
        res: Response,
        view: string,
        data: object = {}
    ) {
        res.render(`${this.viewFolder}/${view}`, data);
    }

    protected redirect(res: Response, routeName: string, ...params: string[]) {
        res.redirect(route(routeName, ...params));
    }

    protected notFound(res: Response) {
        res.status(404).render("views/404");
    }
}
