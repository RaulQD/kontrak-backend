import { prisma } from '../../platform/database/prisma';
import { GetEmployeeUseCase } from './application/use-case/get-employee.use-case';
import { ListEmployeesUseCase } from './application/use-case/list-employee.use-case';
import { PrismaEmployeeRepository } from './infrastructure/persistence/repository/employee.repository';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { EmployeeRouter } from './presentation/routes/employee.routes';

const employeeRepository = new PrismaEmployeeRepository(prisma);

const employeeController = new EmployeeController(
  new GetEmployeeUseCase(employeeRepository),
  new ListEmployeesUseCase(employeeRepository),
);

export const employeesRouter = EmployeeRouter(employeeController);
