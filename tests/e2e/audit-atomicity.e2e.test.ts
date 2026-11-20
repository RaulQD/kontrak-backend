import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { randomUUID } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../../src/platform/database/prisma';
import { writeAudit } from '../../src/platform/audit/audit-writer';
import { AuditAction, AuditEntry } from '../../src/shared/audit/audit-entry';

const EMAIL = 'e2e-audit-atomicity@test.local';

// Reproduce lo que hará cada repositorio auditado (D3): la escritura de negocio
// y writeAudit dentro del mismo prisma.$transaction. La tabla users hace de
// entidad de negocio porque el repositorio de empleados aún no existe.
describe('US-009a: writeAudit es atómico con la escritura de negocio', () => {
  let idUsuario: string;

  const entrada = (correlationId: string): AuditEntry => ({
    actorUserId: idUsuario,
    ipAddress: '127.0.0.1',
    correlationId,
    action: AuditAction.UPDATE,
    entityType: 'users',
    entityId: idUsuario,
    oldValues: { isActive: true },
    newValues: { isActive: false },
  });

  const desactivar = (tx: Parameters<typeof writeAudit>[0], id: string) =>
    tx.user.update({ where: { id }, data: { isActive: false } });

  const filasDe = (correlationId: string) =>
    prisma.auditLog.findMany({ where: { correlationId } });

  const estaActivo = async (): Promise<boolean> => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: idUsuario },
    });
    return user.isActive;
  };

  beforeAll(async () => {
    const existente = await prisma.user.findFirst({
      where: { email: EMAIL, deletedAt: null },
    });
    const user =
      existente ??
      (await prisma.user.create({
        data: { email: EMAIL, passwordHash: await bcrypt.hash('x', 4) },
      }));
    idUsuario = user.id;
  });

  beforeEach(async () => {
    await prisma.user.update({
      where: { id: idUsuario },
      data: { isActive: true },
    });
  });

  afterAll(async () => {
    // Primero la auditoría: la FK es ON DELETE SET NULL y dejaría filas huérfanas.
    await prisma.auditLog.deleteMany({ where: { actorUserId: idUsuario } });
    await prisma.user.delete({ where: { id: idUsuario } });
    await prisma.$disconnect();
  });

  it('si ambas escrituras funcionan, se confirman juntas con el contexto completo', async () => {
    const correlationId = randomUUID();

    await prisma.$transaction(async (tx) => {
      await desactivar(tx, idUsuario);
      await writeAudit(tx, entrada(correlationId));
    });

    expect(await estaActivo()).toBe(false);
    const filas = await filasDe(correlationId);
    expect(filas).toHaveLength(1);
    expect(filas[0]).toMatchObject({
      actorUserId: idUsuario,
      action: 'UPDATE',
      entityType: 'users',
      entityId: idUsuario,
      ipAddress: '127.0.0.1',
      correlationId,
      oldValues: { isActive: true },
      newValues: { isActive: false },
    });
  });

  it('si falla la auditoría, la escritura de negocio se revierte', async () => {
    const correlationId = randomUUID();

    await expect(
      prisma.$transaction(async (tx) => {
        await desactivar(tx, idUsuario);
        // Un actor que no existe viola la FK hacia users: el INSERT falla.
        await writeAudit(tx, {
          ...entrada(correlationId),
          actorUserId: randomUUID(),
        });
      }),
    ).rejects.toThrow();

    expect(await estaActivo()).toBe(true);
    expect(await filasDe(correlationId)).toHaveLength(0);
  });

  it('si falla la escritura de negocio, no queda fila de auditoría', async () => {
    const correlationId = randomUUID();

    await expect(
      prisma.$transaction(async (tx) => {
        // La auditoría va primero para demostrar que el rollback también la borra.
        await writeAudit(tx, entrada(correlationId));
        await desactivar(tx, randomUUID()); // no existe: P2025
      }),
    ).rejects.toThrow();

    expect(await filasDe(correlationId)).toHaveLength(0);
  });
});
