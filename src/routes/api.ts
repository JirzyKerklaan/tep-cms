import express, {Request, Response} from 'express';
import entryService from "../../core/manager/services/entryService";
import config from "../../src/config";
import collectionService from "../../core/manager/services/collectionService";

const router = express.Router();

if (!config.headless_mode) {
    router.get('/*', (req, res) => {
        res.status(404).send({"error": "headless mode is turned off, turn it on via the configuration file (config.ts)"});
    });
}
// Router.use(HasValidToken) o.i.d toevoegen

router.get('/', (req: Request, res: Response) => {
    res.json("Welcome to the API!");
});

router.get('/collections', async (req: Request, res: Response) => {
    let entries = await collectionService.getAll();
    res.json(entries);
});
router.get('/collections/:collection', async (req: Request, res: Response) => {
    let entries = await entryService.getAllFromCollection(req.params.collection);
    res.json(entries);
});

// -------------------- //

export default router;
