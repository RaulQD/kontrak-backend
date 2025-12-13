import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller';
import { excelUpload } from '../middlewares/upload.middleware';
import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { schemaValidatorMiddleware } from '../middlewares/schema-validator.middleware';
import { EmployeeBatchSchema } from '../validators/employee.validator';

const router = Router();
const contractController = new ContractController();

/**
 * POST /api/contracts/upload
 * Endpoint para subir y procesar archivo Excel
 * Body: multipart/form-data con campo 'excel'
 */
// router.post(
//   '/upload',
//   excelUpload.single('excel'),
//   contractController.uploadAndProcessExcel,
// );

/**
 * POST /api/contracts/generate-pdfs
 * Endpoint para generar PDFs de contratos desde Excel
 * Body: multipart/form-data con campo 'excel'
 */
router.post(
  '/upload',
  excelUpload.single('excel'),
  contractController.generateContractPDFs,
);
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
router.get('/preview/:dni', contractController.previewContractPdf);
router.use(ErrorHandleMulter);
export default router;
