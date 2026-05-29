import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import entryService from '@core/admin/services/entryService';
import { VersioningService } from '@core/services/versioningService';
import { ERROR_CODES } from '@core/utils/errors';
import path from "path";

class EntryController extends Controller {
    constructor() {
        super('admin/entries', 'entries');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        try {
            const entries = await entryService.getAll();
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, entries });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    }

    newForm = (req: Request, res: Response): void => {
        res.render(`${this.viewFolder}/new`, {
            layout: 'admin/layouts/admin',
            title: 'Create Entry',
            collection: req.params.collection
        });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const collection = req.params.collection;

        try {
            entryService.saveEntry(<string>collection, req.body)
            res.redirect(`/admin/collections/${collection}`);
        } catch {
            res.status(500).render(`${this.viewFolder}/new`, {
                layout: 'admin/layouts/admin',
                title: 'Create Entry',
                error: 'Failed to create entry file.',
            });        }
    };

    editForm = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        const collectionName = req.params.collection;
        const versioningService = new VersioningService({
            baseDir: path.join(process.cwd(), 'src', 'content', 'collections'),
            maxVersions: 5,
        });
        const olderVersions = await versioningService.getVersions(<string>collectionName, <string>id);

        console.log(olderVersions)

        try {
            const entry = await entryService.getById(<string>collectionName, <string>id);
            if (!entry) {
                res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP461"] });
                return;
            }
            res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, entry, olderVersions, error: ERROR_CODES["TEP200"] });
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES["TEP462"] });
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
            res.redirect('/admin/entries');
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', user: req.session.user, entry: { id, ...data }, error: ERROR_CODES["TEP462"] });
        }
    }
}

export default new EntryController();
