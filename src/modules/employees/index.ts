import { currentAuditContext } from '../../platform/audit/audit-context';
import { prisma } from '../../platform/database/prisma';
import { CreateEmployeeUseCase } from './application/use-case/create-employee.use-case';
import { DeleteEmployeeUseCase } from './application/use-case/delete-employee.use-case';
import { GetEmployeeUseCase } from './application/use-case/get-employee.use-case';
import { ListEmployeesUseCase } from './application/use-case/list-employee.use-case';
import { UpdateEmployeeUseCase } from './application/use-case/update-employee.use-case';
import { PrismaEmployeeRepository } from './infrastructure/persistence/repository/employee.repository';
import { PrismaUbigeoReader } from './infrastructure/persistence/repository/prisma-ubigeo.reader';
import { EmployeeController } from './presentation/controllers/employee.controller';
import { EmployeeRouter } from './presentation/routes/employee.routes';

const employeeRepository = new PrismaEmployeeRepository(prisma);
const ubigeoReader = new PrismaUbigeoReader(prisma);

const employeeController = new EmployeeController(
  new GetEmployeeUseCase(employeeRepository),
  new ListEmployeesUseCase(employeeRepository),
  new CreateEmployeeUseCase(
    ubigeoReader,
    employeeRepository,
    currentAuditContext,
  ),
  new UpdateEmployeeUseCase(
    employeeRepository,
    ubigeoReader,
    currentAuditContext,
  ),
  new DeleteEmployeeUseCase(employeeRepository, currentAuditContext),
);

export const employeesRouter = EmployeeRouter(employeeController);
