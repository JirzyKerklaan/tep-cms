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
    const { collection } = req.params;
    const entries = await entryService.getAll(collection);

    res.json({data: entries});
});

router.get('/:collection/:entry', async (req: Request<{collection: string, entry: string}>, res: Response) => {
    const { collection, entry } = req.params;
    const entryToReturn = await entryService.getById(collection, entry);
    res.json({data: entryToReturn});
});

// -------------------- //

export default router;
