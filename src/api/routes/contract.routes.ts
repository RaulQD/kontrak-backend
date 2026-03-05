import { Router } from 'express';

import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { schemaValidatorMiddleware } from '../middlewares/schema-validator.middleware';
import { EmployeeBatchSchema } from '../../domain/contracts/validators/employee.validator';
import { ContractController } from '../controllers/contract.controller';

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
