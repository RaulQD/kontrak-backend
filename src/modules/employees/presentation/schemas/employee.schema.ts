import { z } from 'zod';
import { DOCUMENT_PATTERNS } from '../../domain/entities/employee.entity';
import { DocumentType } from '../../domain/types';

export const listEmployeesSchema = z.object({
  query: z.strictObject({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z
      .enum(['ACTIVO', 'CESADO', 'SUSPENDIDO', 'VACACIONES', 'SUBSIDIADO'])
      .optional(),
    search: z
      .string()
      .trim()
      .min(2, 'La búsqueda requiere al menos 2 caracteres')
      .optional(),
  }),
});
export const employeeIdSchema = z.object({
  params: z.object({ id: z.uuid() }),
});
export type ListEmployeesQuery = z.infer<typeof listEmployeesSchema>['query'];

const DOCUMENT_MESSAGES: Record<DocumentType, string> = {
  DNI: 'El DNI debe tener exactamente 8 dígitos',
  CE: 'El CE debe tener entre 9 y 12 caracteres alfanuméricos',
  PASAPORTE: 'El pasaporte debe tener entre 6 y 12 caracteres alfanuméricos',
  PTP: 'El PTP debe tener exactamente 9 dígitos',
};

const documentNumber = z
  .string({ error: 'Es obligatorio' })
  .transform((v) => v.replace(/\s+/g, '').toUpperCase())
  .pipe(z.string().min(1, 'Es obligatorio').max(15));

const isRealDate = (s: string): boolean => {
  const d = new Date(`${s}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

/** "2026-08-17" -> Date a medianoche UTC (04 §1.3). */
const dateOnly = z
  .string({ error: 'Debe ser una fecha con formato YYYY-MM-DD' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener el formato YYYY-MM-DD',
    abort: true,
  })
  .refine(isRealDate, 'La fecha no existe en el calendario')
  .transform((s) => new Date(`${s}T00:00:00.000Z`));

const requiredText = (max: number) =>
  z
    .string({ error: 'El campo es obligatorio' })
    .trim()
    .min(1, 'Es obligatorio')
    .max(max, `Máximo ${max} caracteres`);

/**
 * Correo corporativo (US-020c): obligatorio, sin espacios y en minúsculas.
 * El `min(1)` va antes del `pipe` para que un correo vacío diga "obligatorio"
 * y no "no es válido".
 */
const corporateEmail = z
  .string({ error: 'El correo corporativo es obligatorio' })
  .trim()
  .toLowerCase()
  .min(1, 'El correo corporativo es obligatorio')
  .pipe(z.email('El correo no es válido').max(150, 'Máximo 150 caracteres'));

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('El correo no es válido').max(150))
  .optional();

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'No puede estar vacío: omite el campo si no tiene valor')
    .max(max, `Máximo ${max} caracteres`)
    .optional();

export const createEmployeeSchema = z.object({
  body: z
    .strictObject({
      documentType: z.enum(['DNI', 'CE', 'PASAPORTE', 'PTP'], {
        error: 'Use DNI, CE, PASAPORTE o PTP',
      }),
      documentNumber,
      firstNames: requiredText(100),
      lastNameFather: requiredText(60),
      lastNameMother: requiredText(60),
      hireDate: dateOnly,
      employeeCode: optionalText(20),
      sex: z.enum(['MASCULINO', 'FEMENINO']).optional(),
      birthDate: dateOnly.optional(),
      maritalStatus: z
        .enum(['SOLTERO', 'CASADO', 'DIVORCIADO', 'CONVIVIENTE', 'VIUDO'])
        .optional(),
      nationality: optionalText(40),
      email: corporateEmail,
      personalEmail: optionalEmail,
      phone: optionalText(20),
      address: optionalText(300),
      ubigeoId: z
        .string()
        .regex(/^\d{6}$/, 'El ubigeo debe tener 6 dígitos')
        .optional(),
      hasChildrenUnder18: z.boolean().optional(),
      essaludLifeInsurance: z.boolean().optional(),
      photoUrl: optionalText(500),
    })
    .superRefine((body, ctx) => {
      if (!DOCUMENT_PATTERNS[body.documentType].test(body.documentNumber)) {
        ctx.addIssue({
          code: 'custom',
          path: ['documentNumber'],
          message: DOCUMENT_MESSAGES[body.documentType],
        });
      }
    }),
});

const nullableText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'No puede estar vacío: envía null para borrarlo')
    .max(max, `Máximo ${max} caracteres`)
    .nullable()
    .optional();

const nullableEmail = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('El correo no es válido').max(150))
  .nullable()
  .optional();

export const updateEmployeeSchema = z.object({
  params: z.object({ id: z.uuid() }),
  body: z
    .strictObject({
      // No aceptan null: se pueden cambiar, no borrar.
      documentType: z
        .enum(['DNI', 'CE', 'PASAPORTE', 'PTP'], {
          error: 'Use DNI, CE, PASAPORTE o PTP',
        })
        .optional(),
      documentNumber: documentNumber.optional(),
      firstNames: requiredText(100).optional(),
      lastNameFather: requiredText(60).optional(),
      lastNameMother: requiredText(60).optional(),
      nationality: requiredText(40).optional(),
      hireDate: dateOnly.optional(),
      hasChildrenUnder18: z.boolean().optional(),
      essaludLifeInsurance: z.boolean().optional(),
      // Aceptan null para borrar el valor.
      employeeCode: nullableText(20),
      sex: z.enum(['MASCULINO', 'FEMENINO']).nullable().optional(),
      birthDate: dateOnly.nullable().optional(),
      maritalStatus: z
        .enum(['SOLTERO', 'CASADO', 'DIVORCIADO', 'CONVIVIENTE', 'VIUDO'])
        .nullable()
        .optional(),
      email: corporateEmail.optional(),
      personalEmail: nullableEmail,
      phone: nullableText(20),
      address: nullableText(300),
      ubigeoId: z
        .string()
        .regex(/^\d{6}$/, 'El ubigeo debe tener 6 dígitos')
        .nullable()
        .optional(),
      photoUrl: nullableText(500),
      // D5: se aceptan aquí para que el caso de uso responda 403 y no 422.
      status: z.unknown().optional(),
      terminationDate: z.unknown().optional(),
    })
    .refine((body) => Object.keys(body).length > 0, {
      message: 'Debe enviar al menos un campo',
    })
    .superRefine((body, ctx) => {
      // Solo si llegan los dos: con uno solo, la entidad valida contra el
      // tipo que ya tiene el colaborador.
      if (
        body.documentType !== undefined &&
        body.documentNumber !== undefined &&
        !DOCUMENT_PATTERNS[body.documentType].test(body.documentNumber)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['documentNumber'],
          message: DOCUMENT_MESSAGES[body.documentType],
        });
      }
    }),
});
export type UpdateEmployeeBody = z.infer<typeof updateEmployeeSchema>['body'];
