import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import {IController} from "../../interfaces/IController";

export abstract class Controller implements IController {
    protected viewFolder: string;
    protected modelName: string;

    constructor(viewFolder: string, modelName: string) {
        this.viewFolder = viewFolder;
        this.modelName = modelName;
    }

    newForm(req: Request, res: Response): void {
        res.render(`${this.viewFolder}/new`, { layout: 'layouts/manager', title: `Create ${this.modelName}` });
    }

    editForm(req: Request, res: Response): void {
        const id = req.params.id;
        res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', id });
    }

    delete(req: Request, res: Response): void {
        try {
            const id = req.params.id;
            const folderPath = path.join(process.cwd(), 'content', this.modelName, <string>id);
            const schemaPath = path.join(process.cwd(), 'content', 'schemas', this.modelName, `${id}.schema.json`);

            fs.remove(folderPath);
            fs.remove(schemaPath);

            res.redirect(`/manager/${this.modelName}`);
        } catch {
            res.redirect(`/manager/${this.modelName}`);
        }
    }

    // Abstract methods — must be implemented in subclasses
    abstract list(req: Request, res: Response): Promise<void>;
    abstract create(req: Request, res: Response): Promise<void>;
    abstract update(req: Request, res: Response): Promise<void>;
}
