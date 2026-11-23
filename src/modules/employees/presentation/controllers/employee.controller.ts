import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/utils/api-response';
import { catchError } from '../../../../shared/utils/catch-error';
import { GetEmployeeUseCase } from '../../application/use-case/get-employee.use-case';
import { ListEmployeesUseCase } from '../../application/use-case/list-employee.use-case';
import { EmployeeFilters } from '../../domain/types';
import { ListEmployeesQuery } from '../schemas/employee.schema';
import { getAuth } from '../../../auth';

export class EmployeeController {
  constructor(
    private readonly getEmployee: GetEmployeeUseCase,
    private readonly listEmployees: ListEmployeesUseCase,
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
}
