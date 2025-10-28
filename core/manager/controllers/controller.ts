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

    newForm = (req: Request, res: Response): void => {
        res.render(`${this.viewFolder}/new`, { layout: 'layouts/manager', title: `Create ${this.modelName}` });
    };

    editForm = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', id });
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const folderPath = path.join(process.cwd(), 'content', this.modelName, id);
            const schemaPath = path.join(process.cwd(), 'content', 'schemas', this.modelName, `${id}.schema.json`);

            await fs.remove(folderPath);
            await fs.remove(schemaPath);

            res.redirect(`/manager/${this.modelName}`);
        } catch {
            res.redirect(`/manager/${this.modelName}`);
        }
    };

    list = async (req: Request, res: Response): Promise<void> => {};
    create = async (req: Request, res: Response): Promise<void> => {};
    update = async (req: Request, res: Response): Promise<void> => {};

}
