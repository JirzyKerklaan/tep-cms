import {Request, Response} from 'express';
import {Controller} from '@core/admin/controllers/controller';
import entryService from '@core/admin/services/entryService';
import {v4 as uuidv4} from "uuid";
import blockService from "@core/admin/services/blockService";

class EntryController extends Controller {
    constructor() {
        super('admin/entries', 'entries');
    }

    list = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        const { collection } = req.params;
        const entries = await entryService.getAll(collection);

        this.render(res, 'list', {collection, entries})
    };

    createForm = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        const { collection } = req.params;
        const blocks = await blockService.getAll('page_builder');

        this.render(res, 'create', {collection, blocks})
    };

    create = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        const { collection } = req.params;
        const entry = await entryService.create(collection, {
            id: uuidv4(),
            name: req.body.name,
            slug: req.body.slug,
            content: req.body.content,
            published_at: req.body.published_at ?? new Date(),
            scheduled_at: req.body.scheduled_at ?? new Date(),
        });

        this.redirect(res, 'admin.entries.view', collection, entry.slug)
    };

    editForm = async (req: Request<{ collection: string, entry: string }>, res: Response): Promise<void> => {
        const { collection, entry } = req.params;
        const entryToEdit = await entryService.getById(collection, entry)
        const blocks = await blockService.getAll('page_builder');

        this.render(res, 'edit', { collection, entry: entryToEdit, blocks });
    };

    edit = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        const { collection } = req.params;
        const entry = await entryService.edit(collection, {
            id: req.body.id,
            name: req.body.name,
            slug: req.body.slug,
            content: req.body.content,
            published_at: req.body.published_at,
            scheduled_at: req.body.scheduled_at,
        });

        this.redirect(res, 'admin.entries.view', collection, entry.slug)
    }

    view = async (req: Request<{ collection: string, entry: string }>, res: Response): Promise<void> => {
        const { collection, entry } = req.params;
        const entryToView = await entryService.getById(collection, entry);

        this.render(res, 'view', {collection, entry: entryToView})
    };

    delete = async (req: Request<{ collection: string, entry: string }>, res: Response): Promise<void> => {
        const { collection, entry } = req.params;
        await entryService.delete(collection, entry);

        this.redirect(res, 'admin.entries', collection)
    }
}

export default new EntryController();
