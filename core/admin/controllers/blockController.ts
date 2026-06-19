import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import blockService from "@core/admin/services/blockService";

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

  create = async (req: Request, res: Response): Promise<void> => {
      try {

        } catch {
        }
  };

  edit = async (req: Request, res: Response): Promise<void> => {
      try {

      } catch {
      }
  }
}

export default new BlockController();
