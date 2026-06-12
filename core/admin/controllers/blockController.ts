import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Controller } from '@core/admin/controllers/controller';
import blockService from '@core/admin/services/blockService';
import { ERROR_CODES } from '@core/utils/errors';
import {Field} from "@core/interfaces/Field";
import {BlockInput} from "@core/interfaces/BlockInput";

class BlockController extends Controller {
  constructor() {
    super('admin/blocks', 'blocks');
  }

  newForm = (req: Request, res: Response): void => {
    res.render(`${this.viewFolder}/new`, { layout: 'admin/layouts/admin', title: 'Create Block' });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const id = uuidv4();
    const { block, type, fieldsJson } = req.body;

    const fields: Field[] = JSON.parse(fieldsJson);

    const cleanFields: Field[] = fields.map(f => ({
      id: f.id,
      name: f.name,
      type: f.type,
      label: f.label,
      required: f.required ?? false,
      defaultValue: f.defaultValue
    }));

    await blockService.save({ id, block, type, fields: cleanFields });
    res.redirect('/admin/blocks');
  };

  editForm = async (req: Request, res: Response): Promise<void> => {
    const block = await blockService.getById(<string>req.params.id);
    if (!block) {
      res.status(404).send(ERROR_CODES["TEP471"]);
      return;
    }

    res.render(`${this.viewFolder}/edit`, { layout: 'admin/layouts/admin', title: 'Edit Block', block });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const block: BlockInput = {
      id: req.body.id,
      block: req.body.block,
      type: req.body.type,
      fields: JSON.parse(req.body.fields),
    };

    await blockService.update(block);

    res.redirect('/admin/blocks');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await blockService.delete(<string>req.params.id);
      res.redirect('/admin/blocks');
    } catch {
      res.status(500).send(ERROR_CODES["TEP450"]);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const blocks = await blockService.getAll();
      res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, blocks });
    } catch {
      res.status(500).send(ERROR_CODES["TEP450"]);
    }
  };
}

export default new BlockController();
