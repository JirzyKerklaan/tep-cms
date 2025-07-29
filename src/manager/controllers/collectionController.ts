import { Request, Response } from 'express';
import collectionService from '../services/collectionService';
import { getDefaultFields } from '../helpers/defaultFieldsHelper';
import fs from 'fs-extra';
import path from 'path';

const collectionController = {
  newForm: (req: Request, res: Response) => {
    const blocksDir = path.join(process.cwd(), 'src', 'blocks', 'page_builder');
    const blocks = fs
      .readdirSync(blocksDir)
      .filter(file => file.endsWith('.ejs'))
      .map(file => path.basename(file, '.ejs'));

    res.render('manager/collections/new', { title: 'Create Collection', blocks });
  },

  async create(req: Request, res: Response) {
    const { name, blocks } = req.body;
    const selectedBlocks = Array.isArray(blocks) ? blocks : [blocks];

    const schema = {
      name,
      page_builder: selectedBlocks,
      created_at: new Date().toISOString()
    };

    // Save schema
    const schemaPath = path.join(process.cwd(), 'content', 'schemas', 'collections', `${name}.schema.json`);
    await fs.outputJson(schemaPath, schema, { spaces: 2 });

    // Generate standard.json with default values
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
      page_builder: blockData
    };

    const standardPath = path.join(process.cwd(), 'content', 'collections', name, 'standard.json');
    await fs.outputJson(standardPath, standard, { spaces: 2 });

    res.redirect('/manager/collections/list');
  },

  async editForm(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const collection = await collectionService.getCollectionById(id);
      if (!collection) {
        return res.status(404).send('Collection not found');
      }
      res.render('manager/collections/edit', { layout: 'layouts/manager', user: req.session.user, collection, error: null });
    } catch {
      res.status(500).send('Server error');
    }
  },

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    try {
      await collectionService.updateCollection(id, data);
      res.redirect('/manager/collections/list');
    } catch {
      res.render('manager/collections/edit', {
        layout: 'layouts/manager',
        user: req.session.user,
        collection: { id, ...data },
        error: 'Failed to update collection'
      });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const collections = await collectionService.getAllCollections();
      res.render('manager/collections/list', { layout: 'layouts/manager', user: req.session.user, collections });
    } catch {
      res.status(500).send('Server error');
    }
  }
};

export default collectionController;
