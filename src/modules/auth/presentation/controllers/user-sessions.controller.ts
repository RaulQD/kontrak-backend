import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/utils/api-response';
import { catchError } from '../../../../shared/utils/catch-error';
import { DeleteSessionUseCase } from '../../application/delete-session.use-case';

export class UserSessionsController {
  constructor(private readonly deleteSessionUseCase: DeleteSessionUseCase) {}

  public revokeSessions = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.deleteSessionUseCase.execute(String(id));
    return ApiResponse.success(res, result);
  });
}
