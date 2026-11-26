import type { PrismaClient } from '../../../../../generated/prisma/client';
import type { IUbigeoReader } from '../../../application/port/employee.repository.port';

/**
 * Comprueba el ubigeo antes de escribir. Sin esto, un ubigeo inexistente
 * llega a la FK y Prisma responde un P2003 genérico: un 500 en vez de 422.
 */
export class PrismaUbigeoReader implements IUbigeoReader {
  constructor(private readonly prisma: PrismaClient) {}

  async exists(id: string): Promise<boolean> {
    const ubigeo = await this.prisma.ubigeo.findUnique({
      where: { id },
      select: { id: true },
    });
    return ubigeo !== null;
  }
}
