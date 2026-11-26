import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/utils/api-response';
import { catchError } from '../../../../shared/utils/catch-error';
import { GetEmployeeUseCase } from '../../application/use-case/get-employee.use-case';
import { ListEmployeesUseCase } from '../../application/use-case/list-employee.use-case';
import { EmployeeFilters } from '../../domain/types';
import { ListEmployeesQuery } from '../schemas/employee.schema';
import { getAuth } from '../../../auth';
import { CreateEmployeeUseCase } from '../../application/use-case/create-employee.use-case';
import { CreateEmployeeInput } from '../../application/dto/create-employee.dto';
import { UpdateEmployeeUseCase } from '../../application/use-case/update-employee.use-case';
import { DeleteEmployeeUseCase } from '../../application/use-case/delete-employee.use-case';

export class EmployeeController {
  constructor(
    private readonly getEmployee: GetEmployeeUseCase,
    private readonly listEmployees: ListEmployeesUseCase,
    private readonly createEmployee: CreateEmployeeUseCase,
    private readonly updateEmployee: UpdateEmployeeUseCase,
    private readonly softDeleteEmployee: DeleteEmployeeUseCase,
  ) {}

  public getById = catchError(async (req: Request, res: Response) => {
    const { userId, permissions } = getAuth(req);
    const output = await this.getEmployee.execute(String(req.params.id), {
      userId,
      permissions,
    });
    return ApiResponse.success(res, output);
  });

  public getEmployees = catchError(async (req: Request, res: Response) => {
    const { userId, permissions } = getAuth(req);
    const { page, limit, status, search } =
      req.query as unknown as ListEmployeesQuery;
    const filters: EmployeeFilters = {
      page,
      limit,
      ...(status && { status }),
      ...(search && { search }),
    };
    const result = await this.listEmployees.execute(filters, {
      userId,
      permissions,
    });
    return ApiResponse.paginated(res, result.items, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    });
  });
  public create = catchError(async (req: Request, res: Response) => {
    const { userId, permissions } = getAuth(req);
    const result = await this.createEmployee.execute(
      req.body as CreateEmployeeInput,
      { userId, permissions },
    );
    return ApiResponse.created(
      res,
      result,
      'Se registro correctamente el empleado',
    );
  });

  public update = catchError(async (req: Request, res: Response) => {
    const { userId, permissions } = getAuth(req);
    const result = await this.updateEmployee.execute(
      String(req.params.id),
      req.body,
      { userId, permissions },
    );
    return ApiResponse.success(
      res,
      result,
      'Se actualizo correctamente el empleado.',
    );
  });

  public softDelete = catchError(async (req: Request, res: Response) => {
    await this.softDeleteEmployee.execute(String(req.params.id));
    return ApiResponse.ok(res, 'Colaborador anulado');
  });
}
