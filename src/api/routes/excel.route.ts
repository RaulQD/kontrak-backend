import { Router } from 'express';
import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { schemaValidatorMiddleware } from '../middlewares/schema-validator.middleware';
import { excelUpload } from '../middlewares/upload.middleware';
import { ExcelController } from '../controllers/excel.controller';
import { EmployeeBatchSchema } from '../../domain/contracts/validators/employee.validator';

const router = Router();
const excelController = new ExcelController();

router.post(
  '/upload',
  excelUpload.single('excel'),
  excelController.readDataFromExcel,
);
router.get('/excel-to-image', excelController.excelToImage);
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
