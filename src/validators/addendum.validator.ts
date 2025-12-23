import z from 'zod';

export const addendumSchema = z.object({
  division: z.string({ error: 'Division es requerido.' }).trim(),
  documentNumber: z
    .string({ error: 'Número de documento es requerido.' })
    .regex(/^\d{8}$/, 'DNI debe tener exactamente 8 dígitos.')
    .transform((val) => val.trim()),
  worker: z.string({ error: 'El nombre del trabajador es requerido.' }),
  entryDate: z.union(
    [
      z
        .string()
        .regex(
          /^\d{2}\/\d{2}\/\d{4}$/,
          'Fecha debe estar en formato DD/MM/YYYY',
        ),
      z.date(),
    ],
    {
      error: 'Fecha de ingreso es requerida',
    },
  ),
  start: z.union(
    [
      z
        .string()
        .regex(
          /^\d{2}\/\d{2}\/\d{4}$/,
          'Fecha debe estar en formato DD/MM/YYYY',
        ),
      z.date(),
    ],
    {
      error: 'Fecha de inicio es requerida',
    },
  ),
  end: z.union(
    [
      z
        .string()
        .regex(
          /^\d{2}\/\d{2}\/\d{4}$/,
          'Fecha debe estar en formato DD/MM/YYYY',
        ),
      z.date(),
    ],
    {
      error: 'Fecha fin es requerida',
    },
  ),
  startAddendum: z.union(
    [
      z
        .string()
        .regex(
          /^\d{2}\/\d{2}\/\d{4}$/,
          'Fecha debe estar en formato DD/MM/YYYY',
        ),
      z.date(),
    ],
    {
      error: 'Fecha de ingreso es requerida',
    },
  ),
  endAddendum: z.union(
    [
      z
        .string()
        .regex(
          /^\d{2}\/\d{2}\/\d{4}$/,
          'Fecha debe estar en formato DD/MM/YYYY',
        ),
      z.date(),
    ],
    {
      error: 'Fecha de ingreso es requerida',
    },
  ),
  address: z
    .string({ error: 'Dirección es requerida.' })
    .min(5, 'Dirección debe tener al menos 10 caracteres')
    .max(200, 'Dirección no puede exceder 200 caracteres')
    .transform((val) => val.trim()),
  province: z
    .string({ error: 'Provincia es requerida.' })
    .trim()
    .min(2, 'Provincia debe tener al menos 2 caracteres'),
  district: z
    .string({ error: 'Distrito es requerido' })
    .trim()
    .min(2, 'Distrito debe tener al menos 2 caracteres'),
  department: z
    .string({ error: 'Departamento es requerido' })
    .trim()
    .min(2, 'Departamento debe tener al menos 2 caracteres'),
  salary: z
    .number({ error: 'El salario debe ser un número válido' })
    .refine((value) => value > 0, {
      message: 'El sueldo debe ser mayor a 0',
    }),
  salaryInWords: z
    .string({ error: 'El sueldo en letras es requerido' })
    .trim()
    .min(5, 'El sueldo en letras debe tener al menos 5 caracteres')
    .max(100, 'El sueldo en letras no puede exceder 100 caracteres'),
});

export const employeeBatchAddendumSchema = z.object({
  body: z
    .array(addendumSchema)
    .min(1, 'La lista de empleados no puede estar vacía.')
    .max(80, 'Máximo 80 empleados por lote'),
});

export type EmployeeFromAddendum = z.infer<typeof addendumSchema>;
export type EMployeeBatchToAddendum = z.infer<
  typeof employeeBatchAddendumSchema
>;
