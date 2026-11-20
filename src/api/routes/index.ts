import { Router } from 'express';
import contractRoutes from './contract.routes';
import excelRoutes from './excel.route';
import addendumRoutes from './addendum.route';
import { logger } from '../../shared/utils/logger';

const router: Router = Router();
// Rutas de contratos
logger.info('Registrando rutas de contratos...');
router.use('/contracts', contractRoutes);
router.use('/excel', excelRoutes);
router.use('/addendum', addendumRoutes);
logger.info('Rutas de contratos registradas');

export default router;
