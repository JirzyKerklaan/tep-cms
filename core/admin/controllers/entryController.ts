import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import EntryService from '@core/admin/services/entryService';
import { ERROR_CODES } from '@core/utils/errors';
import entryService from "@core/admin/services/entryService";

class EntryController extends Controller {
    constructor() {
        super('admin/entries', 'entries');
    }

    list = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        try {
            const entries = await EntryService.getAll(req.params.collection);
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, entries, collection: req.params.collection });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {

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

    view = async (req: Request<{collection: string, entry: string}>, res: Response): Promise<void> => {
        try {
            const entry = await entryService.getById(req.params.collection, req.params.entry)
            res.render(`${this.viewFolder}/view`, { layout: 'admin/layouts/admin', user: req.session.user, entry });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    };
}

export default new EntryController();
