import { Router } from 'express';
import { ensureAdminAuth } from './middleware/auth';
import * as adminController from './controllers/adminController';

const adminRouter = Router();

// Protect all admin routes with auth middleware
adminRouter.use(ensureAdminAuth);

// Dashboard
adminRouter.get('/', (req, res) => {
  res.send('Dashboard');
});

// Collections
adminRouter.get('/collections', adminController.listCollections);
adminRouter.get('/collections/new', adminController.newCollectionForm);
adminRouter.post('/collections', adminController.createCollection);
adminRouter.get('/collections/:id/edit', adminController.editCollectionForm);
adminRouter.post('/collections/:id', adminController.updateCollection);

// Entries
adminRouter.get('/collections/:collectionId/entries', adminController.listEntries);
adminRouter.get('/collections/:collectionId/entries/new', adminController.newEntryForm);
adminRouter.post('/collections/:collectionId/entries', adminController.createEntry);
adminRouter.get('/collections/:collectionId/entries/:entryId/edit', adminController.editEntryForm);
adminRouter.post('/collections/:collectionId/entries/:entryId', adminController.updateEntry);

export default adminRouter;
