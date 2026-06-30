import {Request, Response} from 'express';
import {Controller} from '@core/admin/controllers/controller';
import blockService from "@core/admin/services/blockService";
import {v4 as uuidv4} from "uuid";

class BlockController extends Controller {
    constructor() {
        super('admin/blocks', 'blocks');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        const blocks = await blockService.getAll('blocks');

        this.render(res, 'list', {blocks});
    };

    createForm = async (req: Request, res: Response): Promise<void> => {
        const blocks = await blockService.getAll('blocks');

        this.render(res, 'create', { blocks });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        await blockService.create({
            id: uuidv4(),
            name: req.body.name,
            type: req.body.type,
            fields: JSON.parse(req.body.fieldsJson)
        });

        this.redirect(res, 'admin.blocks');
    };

    editForm = async (req: Request<{ block: string }>, res: Response): Promise<void> => {
        const { block } = req.params;
        const blockToEdit = await blockService.getById(block, 'page_builder');
        const blocks = await blockService.getAll('blocks');

        this.render(res, 'edit', {block: blockToEdit, blocks});
    };
    edit = async (): Promise<void> => {
    }
}

export default new BlockController();
