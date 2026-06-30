import {Request, Response} from 'express';
import {Controller} from '@core/admin/controllers/controller';
import collectionService from "@core/admin/services/collectionService";
import blockService from "@core/admin/services/blockService";
import {v4 as uuidv4} from "uuid";
import slugify from "slugify";

class CollectionController extends Controller {
    constructor() {
        super('admin/collections', 'collections');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        const collections = await collectionService.getAll();

        this.render(res, 'list', {collections})
    };

    createForm = async (req: Request, res: Response): Promise<void> => {
        const blocks = await blockService.getAll('page_builder');

        this.render(res, 'create', {blocks})
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const collection = await collectionService.create({
            id: uuidv4(),
            slug: slugify(req.body.name),
            name: req.body.name,
            blocks: req.body.blocks
        });

        this.redirect(res, 'admin.entries', collection.slug)
    };

    editForm = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        const { collection } = req.params;
        const collectionToEdit = await collectionService.getById(collection)
        const blocks = await blockService.getAll('page_builder');

        this.render(res, 'edit', {collection: collectionToEdit, blocks})
    };

    edit = async (req: Request, res: Response): Promise<void> => {
        await collectionService.edit({
            id: req.body.id,
            slug: slugify(req.body.name),
            name: req.body.name,
            blocks: req.body.blocks
        });

        this.redirect(res, 'admin.collections')
    };

    delete = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        const { collection } = req.params;
        await collectionService.delete(collection);

        this.redirect(res, 'admin.collections')
    }
}

export default new CollectionController();
