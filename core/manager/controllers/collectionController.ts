import { Request, Response } from 'express';
import { Controller } from './controller';
import collectionService from '../services/collectionService';
import fs from 'fs-extra';
import path from 'path';
import { getDefaultFields } from '../helpers/defaultFieldsHelper';
import { ERROR_CODES } from '../../../src/utils/errors';

class CollectionController extends Controller {
    constructor() {
        super('manager/collections', 'collections');
    }

    list = async (req: Request, res: Response): Promise<void> => {
        try {
            const collections = await collectionService.getAll();
            res.render(`${this.viewFolder}/list`, { layout: 'layouts/manager', user: req.session.user, collections });
        } catch {
            res.render(`${this.viewFolder}/list`, { layout: 'layouts/manager', user: req.session.user, error: ERROR_CODES["TEP460"] });
        }
    }

    newForm = (req: Request, res: Response): void => {
        const blocksDir = path.join(process.cwd(), 'src', 'blocks', 'page_builder');
        const blocks = fs
            .readdirSync(blocksDir)
            .filter(file => file.endsWith('.ejs'))
            .map(file => path.basename(file, '.ejs'));

        res.render(`${this.viewFolder}/new`, {
            layout: 'layouts/manager',
            title: 'Create Collection',
            blocks,
        });
    };

    create = async (req: Request, res: Response): Promise<void> => {
        const { name, blocks } = req.body;
        const selectedBlocks = Array.isArray(blocks) ? blocks : [blocks];

        const schema = {
            name,
            page_builder: selectedBlocks,
            created_at: new Date().toISOString()
        };

        const schemaPath = path.join(process.cwd(), 'content', 'schemas', 'collections', `${name}.schema.json`);
        await fs.outputJson(schemaPath, schema, { spaces: 2 });

        const blockData = [];
        for (const block of selectedBlocks) {
            const blockSchemaPath = path.join(process.cwd(), 'src', 'blocks', 'schemas', 'page_builder', `${block}.schema.json`);
            if (await fs.pathExists(blockSchemaPath)) {
                const blockSchema = await fs.readJson(blockSchemaPath);
                const defaultFields = getDefaultFields(blockSchema.fields || []);
                blockData.push({ block, fields: defaultFields });
            }
        }

        const standard = {
            title: '',
            slug: '',
            content: '',
            page_builder: blockData,
            scheduledAt: req.body.scheduledAt || null,
        };

        const standardPath = path.join(process.cwd(), 'content', 'collections', name, 'standard.json');
        await fs.outputJson(standardPath, standard, { spaces: 2 });

        res.redirect('/manager/collections');
    }

    editForm = async (req: Request, res: Response): Promise<void> => {
        const id = req.params.id;
        try {
            const collection = await collectionService.getById(<string>id);
            if (!collection) {
                res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, error: ERROR_CODES["TEP461"] });
                return;
            }
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, collection, error: ERROR_CODES["TEP200"] });
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
            await collectionService.update(<string>id, data);
            res.redirect('/manager/collections');
        } catch {
            res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', user: req.session.user, collection: { id, ...data }, error: ERROR_CODES["TEP462"] });
        }
    }
}

export default new CollectionController();
