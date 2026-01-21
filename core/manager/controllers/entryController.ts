import { Request, Response } from 'express';
import { Controller } from './controller';
import entryService from '../services/entryService';
import { VersioningService } from '../services/versioningService';
import { ERROR_CODES } from '../../../src/utils/errors';
import { Entry } from '../../interfaces/Entry';
import path from "path";

class EntryController extends Controller {
    constructor() {
        super('manager/entries', 'entries');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        try {
            const entries = await entryService.getAll();
            res.render(`${this.viewFolder}/list`, { layout: 'layouts/manager', user: req.session.user, entries });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'layouts/manager', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    }

    newForm = (req: Request, res: Response): void => {
        res.render(`${this.viewFolder}/new`, {
            layout: 'layouts/manager',
            title: 'Create Entry',
            collection: req.params.collection
        });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const collection = req.params.collection;

        try {
            entryService.saveEntry(<string>collection, req.body)
            res.redirect(`/manager/collections/${collection}`);
        } catch {
            res.status(500).render(`${this.viewFolder}/new`, {
                layout: 'layouts/manager',
                title: 'Create Entry',
                error: 'Failed to create entry file.',
            });        }
    };

    editForm = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const collectionName = req.params.collection;
        const versioningService = new VersioningService({
            baseDir: path.join(process.cwd(), 'content', 'collections'),
            maxVersions: 5,
        });
        const olderVersions = await versioningService.getVersions(<string>collectionName, <string>id);

        try {
            const entry = await entryService.getById(<string>collectionName, <string>id);
            if (!entry) {
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, error: ERROR_CODES["TEP461"] });
                return;
            }
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, entry, olderVersions, error: ERROR_CODES["TEP200"] });
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, error: ERROR_CODES["TEP462"] });
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const data = {
            ...req.body,
            scheduledAt: req.body.scheduledAt || null
        };
        try {
            await entryService.update(<string>id, data);
            res.redirect('/manager/entries');
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, entry: { id, ...data }, error: ERROR_CODES["TEP462"] });
        }
    }
}

export default new EntryController();
