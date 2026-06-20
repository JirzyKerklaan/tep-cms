import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import EntryService from '@core/admin/services/entryService';
import entryService from "@core/admin/services/entryService";
import {v4 as uuidv4} from "uuid";
import blockService from "@core/admin/services/blockService";
import {route} from "@core/utils/namedRoutes";

class EntryController extends Controller {
    constructor() {
        super('admin/entries', 'entries');
    }

    list = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        try {
            console.log(req.params.collection)
            const entries = await EntryService.getAll(req.params.collection);
            res.render(`${this.viewFolder}/list`, { collection: req.params.collection, entries });
        } catch {
        }
    };

    createForm = async (req: Request, res: Response): Promise<void> => {
        const blocks = await blockService.getAll('page_builder');
        res.render(`${this.viewFolder}/create`, { blocks });
    };

    create = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        try {
            const entry = await entryService.create(req.params.collection, {
                id: uuidv4(),
                name: req.body.name,
                slug: req.body.slug,
                content: req.body.content,
                published_at: req.body.published_at,
                scheduled_at: req.body.scheduled_at,
            });
            res.render(`${this.viewFolder}/view`, { entry });
        } catch {
        }
    };

    editForm = async (req: Request<{collection: string, entry: string}>, res: Response): Promise<void> => {
        const entry = await entryService.getById(req.params.collection, req.params.entry)
        const blocks = await blockService.getAll('page_builder');

        res.render(`${this.viewFolder}/edit`, {
            collection: req.params.collection,
            entry: entry,
            blocks: blocks
        });
    };

    edit = async (req: Request<{collection: string}>, res: Response): Promise<void> => {
        try {
            const entry = await entryService.edit(req.params.collection, {
                id: req.body.id,
                name: req.body.name,
                slug: req.body.slug,
                content: req.body.content,
                published_at: req.body.published_at,
                scheduled_at: req.body.scheduled_at,
            });
            res.redirect(route('admin.entries.view', req.params.collection, entry.slug));
        } catch {
        }
    }

    view = async (req: Request<{collection: string, entry: string}>, res: Response): Promise<void> => {
        try {
            const entry = await entryService.getById(req.params.collection, req.params.entry)
            res.render(`${this.viewFolder}/view`, { collection: req.params.collection, entry });
        } catch {
        }
    };
}

export default new EntryController();
