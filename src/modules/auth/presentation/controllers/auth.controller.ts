import { Request, Response } from 'express';
import { catchError } from '../../../../shared/utils/catch-error';
import { LoginUseCase } from '../../application/login.use-case';
import { ApiResponse } from '../../../../shared/utils/api-response';
import { RefreshSessionUseCase } from '../../application/refresh-session.use-case';
import { InvalidRefreshTokenError } from '../../domain/errors/auth.error';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshSessionTokenUseCase: RefreshSessionUseCase,
  ) {}

  public login = catchError(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.loginUseCase.execute({
      email,
      password,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    this.setRefreshCookie(res, result.refreshToken);
    return ApiResponse.success(res, {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    });
  });

  public refreshTOken = catchError(async (req: Request, res: Response) => {
    const token = req.cookies.refresh_token as string | undefined;
    if (!token) {
      throw new InvalidRefreshTokenError();
    }
    const result = await this.refreshSessionTokenUseCase.execute({
      refreshToken: token,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
    this.setRefreshCookie(res, result.refreshToken);
    return ApiResponse.success(res, {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    });
  });

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 86_400_000,
    });
  }
}
