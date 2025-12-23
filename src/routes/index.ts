import { Router } from 'express';
import contractRoutes from './contract.routes';
import excelRoutes from './excel.route';
import addendumRoutes from './addendum.route';

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
console.info('📝 Registrando rutas de contratos...');
router.use('/contracts', contractRoutes);
router.use('/excel', excelRoutes);
router.use('/addendum', addendumRoutes);
console.info('✅ Rutas de contratos registradas');

export default router;
