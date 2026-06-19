import { Request, Response } from 'express';
import {IController} from "@core/interfaces/IController";

export abstract class Controller implements IController {
    protected viewFolder: string;
    protected modelName: string;

    constructor(viewFolder: string, modelName: string) {
        this.viewFolder = viewFolder;
        this.modelName = modelName;
    }

    createForm = (req: Request, res: Response): void => {
        res.render(`${this.viewFolder}/create`);
    };

    // editForm = (req: Request<{ collection: string, }>, res: Response): void => {
    //     const collection = req.params.collection;
    //     res.render(`${this.viewFolder}/edit`, { collection });
    // };

    // Abstract methods — must be implemented in subclasses
    abstract list(req: Request, res: Response): Promise<void>;
    abstract create(req: Request, res: Response): Promise<void>;
    abstract edit(req: Request, res: Response): Promise<void>;
}
