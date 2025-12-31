import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller';
import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { schemaValidatorMiddleware } from '../middlewares/schema-validator.middleware';
import { EmployeeBatchSchema } from '../validators/employee.validator';

const router = Router();
const contractController = new ContractController();

/**
 * POST /api/contracts/generate-pdfs
 * Endpoint para generar PDFs de contratos desde Excel
 * Body: multipart/form-data con campo 'excel'
 */

/**
 * GET /api/contract/generate-pdfs
 * Endpoint para obtener o previsualizarel pdf de contratos.
 * @params: DNI,
 * @query: sessinId, format
 */
router.post(
  '/download-zip',
  schemaValidatorMiddleware(EmployeeBatchSchema),
  contractController.downloadZip,
);
router.post('/preview', contractController.previewContractPdf);
router.use(ErrorHandleMulter);
export default router;
