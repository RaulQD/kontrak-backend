import { Router } from 'express';
import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { excelUpload } from '../middlewares/upload.middleware';
import { AddendumController } from '../controllers/addendum.controller';
import { schemaValidatorMiddleware } from '../middlewares/schema-validator.middleware';
import { employeeBatchAddendumSchema } from '../../domain/contracts/validators/addendum.validator';

const router: Router = Router();
const addendumController = new AddendumController();

router.post(
  '/upload',
  excelUpload.single('excel'),
  addendumController.processExcelToAddendumData,
);
router.post(
  '/process',
  schemaValidatorMiddleware(employeeBatchAddendumSchema),
  addendumController.generateAndDownloadZip,
);
router.use(ErrorHandleMulter);

export default router;
