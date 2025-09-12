import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Controller } from './controller';
import blockService from '../services/blockService';
import { ERROR_CODES } from '../../utils/errors';

class BlockController extends Controller {
  constructor() {
    super('manager/blocks', 'blocks');
  }

  newForm = (req: Request, res: Response): void => {
    res.render(`${this.viewFolder}/new`, { layout: 'layouts/manager', title: 'Create Block' });
  };

  create = async (req: Request, res: Response): Promise<void> => {
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

    await blockService.save({ id, block, type, fields: cleanFields });
    res.redirect('/manager/blocks');
  };

  editForm = async (req: Request, res: Response): Promise<void> => {
    const block = await blockService.getById(req.params.id);
    if (!block) {
      res.status(404).send(ERROR_CODES["TEP471"]);
      return;
    }

    res.render(`${this.viewFolder}/edit`, { layout: 'layouts/manager', title: 'Edit Block', block });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { block, fields, type } = req.body;

    await blockService.update(req.params.id, {
      block,
      type,
      fields: JSON.parse(fields),
    });

    res.redirect('/manager/blocks');
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await blockService.delete(req.params.id);
      res.redirect('/manager/blocks');
    } catch {
      res.status(500).send(ERROR_CODES["TEP450"]);
    }
  };

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const blocks = await blockService.getAll();
      res.render(`${this.viewFolder}/list`, { layout: 'layouts/manager', user: req.session.user, blocks });
    } catch {
      res.status(500).send(ERROR_CODES["TEP450"]);
    }
  };
}

export default new BlockController();
