import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveBlock, updateBlock, getBlockById, listBlocks } from '../services/blockService';
import fs from 'fs-extra';
import path from 'path';
import {ERROR_CODES} from "../../utils/errors";

const blockController = {
  newForm: (req: Request, res: Response) => {
    res.render('manager/blocks/new', { title: 'Create Block' });
  },

  create: async (req: Request, res: Response) => {
    const id = uuidv4();
    const { block, type, fieldsJson } = req.body;
    const fields = JSON.parse(fieldsJson);

    const cleanFields = fields.map((f: any) => {
      const { name, type, label, required, defaultValue } = f;
      const field: any = { name, type, label };
      if (required) field.required = true;
      if (defaultValue) field.defaultValue = defaultValue;
      return field;
    });

    await saveBlock({ id, block, type, fields: cleanFields });
    res.redirect('/manager/blocks/list');
  },

  editForm: async (req: Request, res: Response) => {
    const block = await getBlockById(req.params.id);
    if (!block) return res.status(404).send(ERROR_CODES["TEP471"]);

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
  
  async delete(req: Request, res: Response) {
    try { 
      console.log('delete block');
    } catch {
      res.status(500).send(ERROR_CODES["TEP450"]);
    }
  },
  
  async list(req: Request, res: Response) {
    try {
      const collections = await listBlocks();
      res.render('manager/collections/list', { layout: 'layouts/manager', user: req.session.user, collections });
    } catch {
      res.status(500).send(ERROR_CODES["TEP450"]);
    }
  },
};

export default blockController;
