import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import { ERROR_CODES } from '@core/utils/errors';
import collectionService from "@core/admin/services/collectionService";
import entryService from "@core/admin/services/entryService";
import blockService from "@core/admin/services/blockService";
import {v4 as uuidv4} from "uuid";

class CollectionController extends Controller {
    constructor() {
        super('admin/collections', 'collections');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        try {
            const collections = await collectionService.getAll();
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, collections });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    };

    createForm = async (req: Request, res: Response): Promise<void> => {
        const blocks = await blockService.getAll();
        res.render(`${this.viewFolder}/create`, { blocks });
    };

    create = async (req: Request<{name: string, blocks: string[]}>, res: Response): Promise<void> => {
        try {
            const collection = await collectionService.create({
                id: uuidv4(),
                name: req.body.name,
                blocks: req.body.blocks
            });
            res.render(`${this.viewFolder}/view`, { layout: 'admin/layouts/admin', user: req.session.user, collection });
        } catch {
            res.render(`${this.viewFolder}/create`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES['TEP464'] });
        }
    };

    edit = async (req: Request, res: Response): Promise<void> => {
        try {

        } catch {
            res.render(`${this.viewFolder}/create`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES['TEP464'] });
        }
    }
}

export default new CollectionController();
