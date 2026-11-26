import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate, requirePermission } from '../../../auth';
import { validationErrorMiddleware } from '../../../../shared/middleware/validation-error.middleware';
import {
  employeeIdSchema,
  listEmployeesSchema,
} from '../schemas/employee.schema';

export const EmployeeRouter = (controller: EmployeeController): Router => {
  const router = Router();

  router.get(
    '/',
    authenticate,
    requirePermission('colaborador:leer'),
    validationErrorMiddleware(listEmployeesSchema),
    controller.getEmployees,
  );
  router.get(
    '/:id',
    authenticate,
    requirePermission('colaborador:leer'),
    validationErrorMiddleware(employeeIdSchema),
    controller.getById,
  );

  return router;
};
