import { z } from 'zod';

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
