import { AccountInactiveError } from '../errors/auth.error';

const MAX_FAILED_ATTEMPTS = 5;
const BASE_LOCK_MINUTES = 15;
const FAIL_DECAY_MINUTES = 15;
const MAX_LOCK_MINUTES = 24 * 60;

export interface UserProps {
  id: string;
  email: string;
  passwordHash: string;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastFailedLoginAt: Date | null;
  lockoutsCount: number;
  isActive: boolean;
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly isActive: boolean;
  private _failedLoginAttempts: number;
  private _lockedUntil: Date | null;
  private _lockoutsCount: number;
  private _lastFailedLoginAt: Date | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this._failedLoginAttempts = props.failedLoginAttempts;
    this._lockedUntil = props.lockedUntil;
    this._lockoutsCount = props.lockoutsCount;
    this._lastFailedLoginAt = props.lastFailedLoginAt;
    this.isActive = props.isActive;
  }

  get failedLoginAttempts(): number {
    return this._failedLoginAttempts;
  }

  get lockedUntil(): Date | null {
    return this._lockedUntil;
  }

  get lastFailedLoginAt(): Date | null {
    return this._lastFailedLoginAt;
  }

  get lockoutsCount(): number {
    return this._lockoutsCount;
  }

  isLocked(now: Date): boolean {
    return this.lockedUntil !== null && this.lockedUntil > now;
  }
  ensureActive(): void {
    if (!this.isActive) throw new AccountInactiveError();
  }
  registerFailedLogin(now: Date): void {
    const lastFail = this._lastFailedLoginAt;
    if (
      lastFail &&
      now.getTime() - lastFail.getTime() > FAIL_DECAY_MINUTES * 60_000
    ) {
      this._failedLoginAttempts = 0;
    }
    this._failedLoginAttempts += 1;
    this._lastFailedLoginAt = now;

    if (this._failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      this._lockoutsCount += 1;
      const lockMinutes = Math.min(
        BASE_LOCK_MINUTES * 2 ** (this._lockoutsCount - 1), // 15, 30, 60, 120...
        MAX_LOCK_MINUTES,
      );
      this._lockedUntil = new Date(now.getTime() + lockMinutes * 60_000);
      this._failedLoginAttempts = 0;
    }
  }
  registerSuccessfulLogin(): void {
    this._failedLoginAttempts = 0;
    this._lockedUntil = null;
    this._lastFailedLoginAt = null;
    this._lockoutsCount = 0;
  }
}
