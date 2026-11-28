import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Prisma, type PrismaClient } from '../src/generated/prisma/client';

/** Catálogo INEI versionado en el repo. Fuente y fecha: prisma/data/README.md. */
export const UBIGEO_CSV = join(__dirname, 'data', 'DISTRITOS-INEI.csv');

export type UbigeoRow = {
  id: string;
  department: string;
  province: string;
  district: string;
};

const HEADER = 'id,department,province,district';
const ID_PATTERN = /^\d{6}$/;
const MAX_NAME = 80;
const CHUNK_SIZE = 500;

/**
 * Lee y valida el CSV. Falla con la línea exacta si algo no cuadra, para que un
 * archivo mal editado no llegue a la base a medias.
 */
export function readUbigeoCsv(file: string = UBIGEO_CSV): UbigeoRow[] {
  const [header, ...lines] = readFileSync(file, 'utf8')
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '');

  if (header !== HEADER) {
    throw new Error(`${file}: la cabecera debe ser "${HEADER}"`);
  }

  const seen = new Set<string>();
  return lines.map((line, index) => {
    const lineNumber = index + 2;
    const cells = line.split(',');
    const [id, department, province, district] = cells;
    if (cells.length !== 4 || !id || !department || !province || !district) {
      throw new Error(`${file}:${lineNumber}: se esperaban 4 columnas`);
    }
    if (!ID_PATTERN.test(id)) {
      throw new Error(
        `${file}:${lineNumber}: el ubigeo "${id}" no tiene 6 dígitos`,
      );
    }
    if (seen.has(id)) {
      throw new Error(`${file}:${lineNumber}: el ubigeo ${id} está repetido`);
    }
    if (
      [department, province, district].some((name) => name.length > MAX_NAME)
    ) {
      throw new Error(
        `${file}:${lineNumber}: un nombre pasa de ${MAX_NAME} caracteres`,
      );
    }
    seen.add(id);
    return { id, department, province, district };
  });
}

/**
 * Carga el catálogo. Es idempotente: un ubigeo que ya existe se actualiza (si el
 * INEI corrige un nombre, el seed lo corrige) y nunca se borra ninguno, porque
 * los colaboradores y las sedes los referencian.
 */
export async function seedUbigeo(
  prisma: PrismaClient,
  file: string = UBIGEO_CSV,
): Promise<number> {
  const rows = readUbigeoCsv(file);

  await prisma.$transaction(async (tx) => {
    for (let start = 0; start < rows.length; start += CHUNK_SIZE) {
      const values = rows
        .slice(start, start + CHUNK_SIZE)
        .map(
          (row) =>
            Prisma.sql`(${row.id}, ${row.department}, ${row.province}, ${row.district})`,
        );
      await tx.$executeRaw`
        INSERT INTO "ubigeo" ("id", "department", "province", "district")
        VALUES ${Prisma.join(values)}
        ON CONFLICT ("id") DO UPDATE SET
          "department" = EXCLUDED."department",
          "province" = EXCLUDED."province",
          "district" = EXCLUDED."district"`;
    }
  });

  return rows.length;
}
