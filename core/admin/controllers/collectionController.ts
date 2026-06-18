import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import fs from 'fs-extra';
import path from 'path';
import { ERROR_CODES } from '@core/utils/errors';
import {Collection} from "@core/interfaces/Collection";
import {route} from "@core/utils/namedRoutes";
import {collectionController} from "@core/admin/controllers/index";
import collectionService from "@core/admin/services/collectionService";

class CollectionController extends Controller {
    constructor() {
        super('admin/collections', 'collections');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        const collections = await collectionService.getAll()
        try {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, collections });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    }
}

export default new CollectionController();
