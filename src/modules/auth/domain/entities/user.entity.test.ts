import { describe, expect, it } from 'vitest';
import { User, UserProps } from './user.entity';
import { AccountInactiveError } from '../errors/auth.error';

const NOW = new Date('2026-07-30T12:00:00.000Z');

const minutesAfter = (base: Date, minutes: number): Date =>
  new Date(base.getTime() + minutes * 60_000);

const makeUser = (over: Partial<UserProps> = {}): User =>
  new User({
    id: 'user-1',
    email: 'admin@kontrak.com',
    passwordHash: '$2a$12$hash-de-prueba',
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastFailedLoginAt: null,
    lockoutsCount: 0,
    isActive: true,
    ...over,
  });

describe('User', () => {
  describe('isLocked', () => {
    it('no está bloqueado cuando lockedUntil es null', () => {
      const user = makeUser({ lockedUntil: null });
      expect(user.isLocked(NOW)).toBe(false);
    });

    it('está bloqueado cuando lockedUntil es una fecha futura', () => {
      const user = makeUser({ lockedUntil: minutesAfter(NOW, 10) });
      expect(user.isLocked(NOW)).toBe(true);
    });

    it('no está bloqueado cuando lockedUntil ya pasó', () => {
      const user = makeUser({ lockedUntil: minutesAfter(NOW, -1) });
      expect(user.isLocked(NOW)).toBe(false);
    });
  });

  describe('ensureActive', () => {
    it('no lanza error cuando la cuenta está activa', () => {
      const user = makeUser({ isActive: true });
      expect(() => user.ensureActive()).not.toThrow();
    });

    it('lanza AccountInactiveError cuando la cuenta está desactivada', () => {
      const user = makeUser({ isActive: false });
      expect(() => user.ensureActive()).toThrow(AccountInactiveError);
    });
  });

  describe('registerFailedLogin', () => {
    it('incrementa el contador de intentos fallidos', () => {
      const user = makeUser({ failedLoginAttempts: 0 });
      user.registerFailedLogin(NOW);
      expect(user.failedLoginAttempts).toBe(1);
      expect(user.lockedUntil).toBeNull();
    });

    it('no bloquea la cuenta antes del quinto intento', () => {
      const user = makeUser({ failedLoginAttempts: 3 });
      user.registerFailedLogin(NOW);
      expect(user.failedLoginAttempts).toBe(4);
      expect(user.isLocked(NOW)).toBe(false);
    });

    it('al quinto intento bloquea por 15 minutos y reinicia el contador', () => {
      const user = makeUser({ failedLoginAttempts: 4 });
      user.registerFailedLogin(NOW);
      expect(user.lockedUntil).toEqual(minutesAfter(NOW, 15));
      expect(user.failedLoginAttempts).toBe(0);
      expect(user.isLocked(NOW)).toBe(true);
    });

    it('el bloqueo expira pasados los 15 minutos', () => {
      const user = makeUser({ failedLoginAttempts: 4 });
      user.registerFailedLogin(NOW);
      expect(user.isLocked(minutesAfter(NOW, 16))).toBe(false);
    });

    it('acumula el bloqueo tras 5 intentos consecutivos partiendo de cero', () => {
      const user = makeUser({ failedLoginAttempts: 0 });
      for (let i = 0; i < 5; i++) {
        user.registerFailedLogin(NOW);
      }
      expect(user.isLocked(NOW)).toBe(true);
      expect(user.failedLoginAttempts).toBe(0);
    });
  });

  describe('decaimiento de la racha de fallos', () => {
    it('reinicia la racha si el último fallo fue hace más de 15 minutos', () => {
      const user = makeUser({
        failedLoginAttempts: 4,
        lastFailedLoginAt: minutesAfter(NOW, -16),
      });
      user.registerFailedLogin(NOW);
      // la racha vieja prescribió: este fallo cuenta como el primero, no el quinto
      expect(user.failedLoginAttempts).toBe(1);
      expect(user.isLocked(NOW)).toBe(false);
    });

    it('mantiene la racha si el último fallo fue dentro de la ventana', () => {
      const user = makeUser({
        failedLoginAttempts: 4,
        lastFailedLoginAt: minutesAfter(NOW, -10),
      });
      user.registerFailedLogin(NOW);
      // quinto fallo dentro de la ventana: bloquea
      expect(user.isLocked(NOW)).toBe(true);
    });
  });

  describe('backoff creciente de bloqueos', () => {
    it('el segundo bloqueo dura 30 minutos', () => {
      const user = makeUser({
        failedLoginAttempts: 4,
        lockoutsCount: 1,
        lastFailedLoginAt: minutesAfter(NOW, -1),
      });
      user.registerFailedLogin(NOW);
      expect(user.lockedUntil).toEqual(minutesAfter(NOW, 30));
      expect(user.lockoutsCount).toBe(2);
    });

    it('la duración del bloqueo tiene un techo de 24 horas', () => {
      const user = makeUser({
        failedLoginAttempts: 4,
        lockoutsCount: 10,
        lastFailedLoginAt: minutesAfter(NOW, -1),
      });
      user.registerFailedLogin(NOW);
      expect(user.lockedUntil).toEqual(minutesAfter(NOW, 24 * 60));
    });

    it('un login exitoso desescala el backoff: el siguiente bloqueo vuelve a 15 minutos', () => {
      const user = makeUser({ lockoutsCount: 3 });
      user.registerSuccessfulLogin();
      for (let i = 0; i < 5; i++) {
        user.registerFailedLogin(NOW);
      }
      expect(user.lockedUntil).toEqual(minutesAfter(NOW, 15));
    });
  });

  describe('registerSuccessfulLogin', () => {
    it('reinicia el contador, quita el bloqueo y limpia la metadata de fallos', () => {
      const user = makeUser({
        failedLoginAttempts: 3,
        lockedUntil: minutesAfter(NOW, 10),
        lastFailedLoginAt: minutesAfter(NOW, -5),
        lockoutsCount: 2,
      });
      user.registerSuccessfulLogin();
      expect(user.failedLoginAttempts).toBe(0);
      expect(user.lockedUntil).toBeNull();
      expect(user.lastFailedLoginAt).toBeNull();
      expect(user.lockoutsCount).toBe(0);
    });
  });
});
