import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import blockService from "@core/admin/services/blockService";
import {v4 as uuidv4} from "uuid";
import {route} from "@core/utils/namedRoutes";

class BlockController extends Controller {
  constructor() {
    super('admin/blocks', 'blocks');
  }

  list = async (req: Request, res: Response): Promise<void> => {
      try {
          const blocks = await blockService.getAll('blocks');
          res.render(`${this.viewFolder}/list`, { blocks });
      } catch {
      }
  };

    createForm = async (req: Request, res: Response): Promise<void> => {
        const blocks = await blockService.getAll('blocks');
        res.render(`${this.viewFolder}/create`, { blocks });
    };

  create = async (req: Request, res: Response): Promise<void> => {
      try {
          await blockService.create({
              id: uuidv4(),
              name: req.body.name,
              type: req.body.type,
              fields: JSON.parse(req.body.fieldsJson)
          });

          res.redirect(route('admin.blocks'));
      } catch {
      }
  };

    editForm = async (req: Request<{block: string}>, res: Response): Promise<void> => {
        const block = await blockService.getById(req.params.block, 'page_builder')
        const blocks = await blockService.getAll('blocks');

        res.render(`${this.viewFolder}/edit`, { block, blocks });
    };
  edit = async (req: Request, res: Response): Promise<void> => {
      try {

      } catch {
      }
  }
}

export default new BlockController();
