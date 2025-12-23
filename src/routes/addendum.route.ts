import { Router } from 'express';
import { ErrorHandleMulter } from '../middlewares/error-handler-multer.middleware';
import { AddendumController } from '../controllers/addendum.controller';
import { excelUpload } from '../middlewares/upload.middleware';

const router = Router();
const addendumController = new AddendumController();

router.post(
  '/upload',
  excelUpload.single('excel'),
  addendumController.processExcelToAddendumData,
);
router.use(ErrorHandleMulter);

export default router;
