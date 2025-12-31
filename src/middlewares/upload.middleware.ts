import multer from 'multer';
import { Request } from 'express';
import { config } from '../config';
import { AppError } from '../utils/app-error';
import { BAD_REQUEST } from '../constants/http';
import { ALLOWED_EXCEL_MIMES, ALLOWED_EXTENSIONS } from '../constants/excel';
import path from 'path';

export const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.limits.maxFileSize,
    files: 1,
  },
  fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback,
  ) {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isValidExtension = ALLOWED_EXTENSIONS.includes(fileExtension);
    if (!isValidExtension) {
      return cb(
        new AppError(
          `Tipo de archivo no permitidos ${fileExtension}. solo se permiten archivos Excel( .xlsx, .xls,.csv)`,
          BAD_REQUEST,
        ),
      );
    }

    const isValidMimeType = ALLOWED_EXCEL_MIMES.includes(file.mimetype);
    if (!isValidMimeType) {
      return cb(
        new AppError(
          `Extensiones de archivo no permitidas: ${fileExtension}.Solo se permiten: ${ALLOWED_EXTENSIONS.join(', ')}`,
          BAD_REQUEST,
        ),
      );
    }
    cb(null, true);
  },
});
