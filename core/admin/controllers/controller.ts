import { Request, Response } from 'express';
import {IController} from "@core/interfaces/IController";

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
}
