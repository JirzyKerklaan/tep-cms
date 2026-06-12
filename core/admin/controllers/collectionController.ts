import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import collectionService from '@core/admin/services/collectionService';
import fs from 'fs-extra';
import path from 'path';
import { getDefaultFields } from '@core/admin/helpers/defaultFieldsHelper';
import { ERROR_CODES } from '@core/utils/errors';
import {Collection} from "@core/interfaces/Collection";
import {route} from "@core/utils/namedRoutes";

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
    }

    newForm = (req: Request, res: Response): void => {
        const blocksDir = path.join(process.cwd(), 'src', 'views', 'page_builder');
        const blocks = fs
            .readdirSync(blocksDir)
            .filter(file => file.endsWith('.twig'))
            .map(file => path.basename(file, '.twig'));

        res.render(`${this.viewFolder}/new`, {
            layout: 'admin/layouts/admin',
            title: 'Create Collection',
            blocks,
        });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const collection: Collection = {
            id: req.body.id,
            name: req.body.name,
            blocks: req.body.blocks,
        };

        const createdCollection = await collectionService.create(collection);

        if (createdCollection) {
            res.redirect(route('admin.collections'));
        } else {
            res.redirect(route('admin.collections.new'))
        }
    }

    editForm = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            const collection = await collectionService.getById(<string>id);
            if (!collection) {
                res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP461"] });
                return;
            }
            res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, collection, error: ERROR_CODES["TEP200"] });
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP462"] });
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const collection: Collection = {
            id: req.body.id,
            name: req.body.name,
            blocks: req.body.blocks,
        };

        try {
            await collectionService.update(collection);
            res.redirect('/admin/collections');
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, collection: collection, error: ERROR_CODES["TEP462"] });
        }
    }
}

export default new CollectionController();
