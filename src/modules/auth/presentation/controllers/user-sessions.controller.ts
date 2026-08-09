import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/utils/api-response';
import { catchError } from '../../../../shared/utils/catch-error';
import { DeleteSessionUseCase } from '../../application/delete-session.use-case';
import { getAuth } from '../../../../shared/helpers';
import { ForbiddenError } from '../../../../shared/utils/app-error-v2';

export class UserSessionsController {
  constructor(private readonly deleteSessionUseCase: DeleteSessionUseCase) {}

  public revokeSessions = catchError(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = getAuth(req);
    if (userId !== id) {
      throw new ForbiddenError('No puedes revocar sesiones de otro usuario');
    }
    const result = await this.deleteSessionUseCase.execute(String(id));
    return ApiResponse.success(res, result);
  });
}
