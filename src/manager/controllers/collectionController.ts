import { Request, Response } from 'express';
import collectionHelper from '../helpers/collectionHelper';

const collectionController = {
  newForm(req: Request, res: Response) {
    res.render('manager/collection/create', { layout: 'manager', user: req.session.user, error: null });
  },

  async create(req: Request, res: Response) {
    try {
      const data = req.body;
      await collectionHelper.createCollection(data);
      res.redirect('/manager/collection/list');
    } catch (error) {
      res.render('manager/collection/create', {
        layout: 'manager',
        user: req.session.user,
        error: 'Failed to create collection'
      });
    }
  },

  async editForm(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const collection = await collectionHelper.getCollectionById(id);
      if (!collection) {
        return res.status(404).send('Collection not found');
      }
      res.render('manager/collection/edit', { layout: 'manager', user: req.session.user, collection, error: null });
    } catch {
      res.status(500).send('Server error');
    }
  },

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const data = req.body;
    try {
      await collectionHelper.updateCollection(id, data);
      res.redirect('/manager/collection/list');
    } catch {
      res.render('manager/collection/edit', {
        layout: 'manager',
        user: req.session.user,
        collection: { id, ...data },
        error: 'Failed to update collection'
      });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const collections = await collectionHelper.getAllCollections();
      res.render('manager/collection/list', { layout: 'manager', user: req.session.user, collections });
    } catch {
      res.status(500).send('Server error');
    }
  }
};

export default collectionController;
