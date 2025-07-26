import { Request, Response } from 'express';

export function dashboard(req: Request, res: Response) {
  res.render('views/dashboard', { layout: 'adminMain' });
}

export function listCollections(req: Request, res: Response) {
  res.render('admin/collections/list');
}

export function newCollectionForm(req: Request, res: Response) {
  res.render('admin/collections/new');
}

export function createCollection(req: Request, res: Response) {
  // Handle collection creation logic
  res.redirect('/manager/collections');
}

export function editCollectionForm(req: Request, res: Response) {
  res.render('admin/collections/edit');
}

export function updateCollection(req: Request, res: Response) {
  // Handle collection update
  res.redirect('/manager/collections');
}

export function listEntries(req: Request, res: Response) {
  res.render('admin/entries/list');
}

export function newEntryForm(req: Request, res: Response) {
  res.render('admin/entries/new');
}

export function createEntry(req: Request, res: Response) {
  res.redirect(`/manager/collections/${req.params.collectionId}/entries`);
}

export function editEntryForm(req: Request, res: Response) {
  res.render('admin/entries/edit');
}

export function updateEntry(req: Request, res: Response) {
  res.redirect(`/manager/collections/${req.params.collectionId}/entries`);
}
