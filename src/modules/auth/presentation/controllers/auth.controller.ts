import { Request, Response } from 'express';
import { catchError } from '../../../../shared/utils/catch-error';
import { LoginUseCase } from '../../application/login.use-case';
import { ApiResponse } from '../../../../shared/utils/api-response';

export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  public login = catchError(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.loginUseCase.execute({
      email,
      password,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth', // solo viaja a los endpoints de auth,
      maxAge: 7 * 86_400_000,
    });
    return ApiResponse.success(res, {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    });
  });
}
