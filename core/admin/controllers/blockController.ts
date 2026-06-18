import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import { ERROR_CODES } from '@core/utils/errors';
import blockService from "@core/admin/services/blockService";
import collectionService from "@core/admin/services/collectionService";

class BlockController extends Controller {
  constructor() {
    super('admin/blocks', 'blocks');
  }

  list = async (req: Request, res: Response): Promise<void> => {
      try {
          const blocks = await blockService.getAll();
          res.render(`${this.viewFolder}/list`, { layout: 'admin/layouts/admin', user: req.session.user, blocks });
      } catch {
          res.status(500).send(ERROR_CODES["TEP450"]);
      }
  };

  create = async (req: Request, res: Response): Promise<void> => {
      try {

        } catch {
           res.render(`${this.viewFolder}/create`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES['TEP464'] });
        }
  };

  edit = async (req: Request, res: Response): Promise<void> => {
      try {

      } catch {
         res.render(`${this.viewFolder}/create`, { layout: 'admin/layouts/admin', user: req.session.user, error: ERROR_CODES['TEP464'] });
      }
  }
}

export default new BlockController();
