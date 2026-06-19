import express, {Request, Response} from 'express';
import entryService from "@core/admin/services/entryService";
import config from "@root/config";
import collectionService from "@core/admin/services/collectionService";
import {HasValidToken} from "@core/admin/middlewares/hasValidToken";

const router = express.Router();

// -------------------- //

router.use(HasValidToken);

if (!config.headless_mode) {
    router.get('/*', (req, res) => {
        res.status(420).send({"error": "headless mode is turned off for this installation, turn it on via your CMS configuration file"});
    });
}

router.get('/collections', async (req: Request, res: Response) => {
    const entries = await collectionService.getAll();
    res.json({data: entries});
});
router.get('/:collection', async (req: Request<{collection: string}>, res: Response) => {
    const entries = await entryService.getAll(req.params.collection);

    res.json({data: entries});
});

router.get('/:collection/:entry', async (req: Request<{collection: string, entry: string}>, res: Response) => {
    const entry = await entryService.getById(req.params.collection, req.params.entry);
    res.json({data: entry});
});

// -------------------- //

export default router;
