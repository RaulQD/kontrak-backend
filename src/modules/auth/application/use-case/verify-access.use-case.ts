import { AccessRevokedError } from '../../domain/errors/auth.error';
import { VerifiedAccessPayload } from '../../domain/types';
import { ITokenSigner } from '../ports/token-signer.port';
import { IUserRepository } from '../ports/user.repository.port';

export class VerifyAccessUseCase {
  constructor(
    private readonly signer: ITokenSigner,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(token: string): Promise<VerifiedAccessPayload> {
    const payload = this.signer.verifyAccess(token);
    const status = await this.userRepository.findAccessStatus(payload.sub);

    if (!status || !status.isActive) throw new AccessRevokedError();

    if (
      status.tokensRevokedAt &&
      payload.iat * 1000 < status.tokensRevokedAt.getTime()
    ) {
      throw new AccessRevokedError();
    }
    return payload;
  }
}
