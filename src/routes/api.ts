import express, {Request, Response} from 'express';
import entryService from "../../core/manager/services/entryService";
import config from "../../src/config";
import collectionService from "../../core/manager/services/collectionService";
import {HasValidToken} from "../../core/middlewares/hasValidToken";

const router = express.Router();

// -------------------- //

router.use(HasValidToken);

if (!config.headless_mode) {
    router.get('/*', (req, res) => {
        res.status(420).send({"error": "headless mode is turned off for this installation, turn it on via your CMS configuration file"});
    });
}

router.get('/collections', async (req: Request, res: Response) => {
    let entries = await collectionService.getAll();
    res.json({data: entries});
});
router.get('/:collection', async (req: Request, res: Response) => {
    let entries = await entryService.getAllFromCollection(<string>req.params.collection);
    res.json({data: entries});
});

router.get('/:collection/:entry', async (req: Request, res: Response) => {
    let entry = await entryService.getById(<string>req.params.collection, <string>req.params.entry);
    res.json({data: entry});
});

// -------------------- //

export default router;
