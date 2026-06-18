import { Request, Response } from 'express';
import { Controller } from '@core/admin/controllers/controller';
import { ERROR_CODES } from '@core/utils/errors';
import blockService from "@core/admin/services/blockService";

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
}

export default new BlockController();
