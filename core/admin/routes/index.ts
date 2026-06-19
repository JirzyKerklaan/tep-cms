import { Router } from 'express';
import routes from '@core/admin/routes/routes';
import upload from '@core/admin/routes/upload';
import search from '@core/admin/routes/search';
import adminRoutes from '@core/admin/routes/admin';
import apiRoutes from '@core/admin/routes/api';

const router = Router();

router.use('/', routes)
router.use('/api', apiRoutes);
router.use('/admin', adminRoutes);
router.use('/', upload);
router.use('/', search);

export default router;
