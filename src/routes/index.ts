import { Router } from 'express';
import routes from './routes';
import upload from './upload';
import search from './search';
import managerRoutes from './manager';
import apiRoutes from './api';

const router = Router();

router.use('/', routes)
router.use('/api', apiRoutes);
router.use('/manager', managerRoutes);
router.use('/', upload);
router.use('/', search);

export default router;
