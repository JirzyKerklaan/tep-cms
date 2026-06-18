import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import { ERROR_CODES } from '@core/utils/errors';
import collectionService from "@core/admin/services/collectionService";

class CollectionController extends Controller {
    constructor() {
        super('admin/collections', 'collections');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        try {
            const collections = await collectionService.getAll()
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, collections });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    }
}

export default new CollectionController();
