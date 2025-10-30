import { Request, Response } from 'express';
import { Controller } from './controller';
import entryService from '../services/entryService';
import fs from 'fs-extra';
import path from 'path';
import { getDefaultFields } from '../helpers/defaultFieldsHelper';
import { ERROR_CODES } from '../../../src/utils/errors';

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
            entryService.saveEntry(collection, req.body)
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
        try {
            const entry = await entryService.getById(collectionName, id);
            if (!entry) {
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, error: ERROR_CODES["TEP461"] });
                return;
            }
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, entry, error: ERROR_CODES["TEP200"] });
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
            await entryService.update(id, data);
            res.redirect('/manager/entries');
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, entry: { id, ...data }, error: ERROR_CODES["TEP462"] });
        }
    }
}

export default new EntryController();
