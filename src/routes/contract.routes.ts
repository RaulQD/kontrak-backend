import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller';
import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { schemaValidatorMiddleware } from '../middlewares/schema-validator.middleware';
import { EmployeeBatchSchema } from '../validators/employee.validator';

const router = Router();
const contractController = new ContractController();

router.post(
  '/download-zip',
  schemaValidatorMiddleware(EmployeeBatchSchema),
  contractController.downloadZip,
);
router.post('/preview', contractController.previewContractPdf);
router.use(ErrorHandleMulter);
export default router;
