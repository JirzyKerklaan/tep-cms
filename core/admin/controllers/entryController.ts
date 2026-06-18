import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import EntryService from '@core/admin/services/entryService';
import { ERROR_CODES } from '@core/utils/errors';

class EntryController extends Controller {
    constructor() {
        super('admin/entries', 'entries');
    }

    list = async (req: Request<{ collection: string }>, res: Response): Promise<void> => {
        try {
            const entries = await EntryService.getAll(req.params.collection);
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, entries });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    }
}

export default new EntryController();
