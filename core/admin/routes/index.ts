import { Router } from 'express';
import routes from './routes';
import upload from './upload';
import search from './search';
import adminRoutes from './admin';
import apiRoutes from './api';

const router = Router();

router.use('/', routes)
router.use('/api', apiRoutes);
router.use('/admin', adminRoutes);
router.use('/', upload);
router.use('/', search);

export default router;
