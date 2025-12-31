import { Router } from 'express';
import contractRoutes from './contract.routes';
import excelRoutes from './excel.route';
import addendumRoutes from './addendum.route';
import { logger } from '../utils/logger';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  console.info('✅ Health check endpoint alcanzado', req.path);
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
});

// Rutas de contratos
logger.info('📝 Registrando rutas de contratos...');
router.use('/contracts', contractRoutes);
router.use('/excel', excelRoutes);
router.use('/addendum', addendumRoutes);
logger.info('✅ Rutas de contratos registradas');

export default router;
