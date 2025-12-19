import { Router } from 'express';
import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { schemaValidatorMiddleware } from '../middlewares/schema-validator.middleware';
import { EmployeeBatchSchema } from '../validators/employee.validator';
import { ExcelController } from '../controllers/excel.controller';

const router = Router();
const excelController = new ExcelController();

router.post(
  '/download-lawlife',
  schemaValidatorMiddleware(EmployeeBatchSchema),
  excelController.generateExcelLawLife,
);
router.post(
  '/download-sctr',
  schemaValidatorMiddleware(EmployeeBatchSchema),
  excelController.generateExcelSCTR,
);
router.post(
  '/download-photocheck',
  schemaValidatorMiddleware(EmployeeBatchSchema),
  excelController.generateExcelCardID,
);
router.use(ErrorHandleMulter);

export default router;
