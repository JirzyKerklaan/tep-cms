import { Request, Response } from 'express';
import { saveBlock, updateBlock, getBlockById } from '../services/blockService';
import { v4 as uuidv4 } from 'uuid';

const blockController = {
  newForm: (req: Request, res: Response) => {
    res.render('manager/blocks/new', { title: 'Create Block' });
  },

  create: async (req: Request, res: Response) => {
    const id = uuidv4();
    const { block, type, fields } = req.body;

    await saveBlock({
      id,
      block,
      type,
      fields: JSON.parse(fields),
    });

    res.redirect('/manager/blocks/list');
  },

  editForm: async (req: Request, res: Response) => {
    const block = await getBlockById(req.params.id);
    if (!block) return res.status(404).send('Block not found');

    res.render('manager/blocks/edit', { title: 'Edit Block', block });
  },

  update: async (req: Request, res: Response) => {
    const { block, fields, type } = req.body;

    await updateBlock(req.params.id, {
      block,
      type,
      fields: JSON.parse(fields),
    });

    res.redirect('/manager/blocks/list');
  },
};

export default blockController;
