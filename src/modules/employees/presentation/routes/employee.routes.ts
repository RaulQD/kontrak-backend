import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authenticate, requirePermission } from '../../../auth';
import { validationErrorMiddleware } from '../../../../shared/middleware/validation-error.middleware';
import {
  createEmployeeSchema,
  employeeIdSchema,
  listEmployeesSchema,
  updateEmployeeSchema,
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
  router.post(
    '/',
    authenticate,
    requirePermission('colaborador:crear'),
    validationErrorMiddleware(createEmployeeSchema),
    controller.create,
  );
  router.patch(
    '/:id',
    authenticate,
    requirePermission('colaborador:editar'),
    validationErrorMiddleware(updateEmployeeSchema),
    controller.update,
  );
  router.delete(
    '/:id',
    authenticate,
    requirePermission('colaborador:cesar'),
    validationErrorMiddleware(employeeIdSchema),
    controller.softDelete,
  );

  return router;
};
