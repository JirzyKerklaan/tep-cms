import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import collectionService from "@core/admin/services/collectionService";
import blockService from "@core/admin/services/blockService";
import {v4 as uuidv4} from "uuid";

class CollectionController extends Controller {
    constructor() {
        super('admin/collections', 'collections');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        try {
            const collections = await collectionService.getAll();
            res.render(`${this.viewFolder}/list`, { collections });
        } catch {
        }
    };

    createForm = async (req: Request, res: Response): Promise<void> => {
        const blocks = await blockService.getAll('page_builder');
        res.render(`${this.viewFolder}/create`, { blocks });
    };

    create = async (req: Request<{name: string, blocks: string[]}>, res: Response): Promise<void> => {
        try {
            const collection = await collectionService.create({
                id: uuidv4(),
                name: req.body.name,
                blocks: req.body.blocks
            });
            res.render(`${this.viewFolder}/view`, { collection });
        } catch {
        }
    };

    editForm = async (req: Request<{collection: string}>, res: Response): Promise<void> => {
        const collection = await collectionService.getById(req.params.collection)
        const blocks = await blockService.getAll('page_builder');
        res.render(`${this.viewFolder}/edit`, { collection, blocks });
    };

    edit = async (req: Request, res: Response): Promise<void> => {
        try {

        } catch {
        }
    }
}

export default new CollectionController();
