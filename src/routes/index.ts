import { Router } from 'express';
import routes from './routes';
import upload from './upload';
import search from './search';
import managerRoutes from './manager';

const router = Router();

router.use('/', routes);
router.use('/', upload);
router.use('/', search);
router.use('/manager', managerRoutes);

export default router;
