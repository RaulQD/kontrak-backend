import z from 'zod';

export const CONTRACT_TYPES = [
  'PLANILLA',
  'PART TIME',
  'SUBSIDIO',
  'APE',
] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];
// Esquema para normalizar y validar tipo de contrato
export const contractTypeSchema = z
  .string('El tipo de contrato es obligatorio')
  .trim()
  .transform((val) => {
    // Normalizar tipo de contrato
    const lower = val.toLowerCase();
    if (lower === 'planilla') return 'Planilla';
    if (lower === 'subsidio' || lower === 'suplencia' || lower === 'reemplazo')
      return 'Subsidio';
    if (lower === 'part time' || lower === 'part-time' || lower === 'parttime')
      return 'Part-time';
    if (lower === 'ape') return 'Ape';
    return val;
  })
  .refine((val) => ['Planilla', 'Subsidio', 'Part-time', 'Ape'].includes(val), {
    message:
      'El tipo de contrato debe ser: Planilla, Subsidio, Part-time o Ape',
  });
export const AddressSchema = z.object({
  province: z.string({ error: 'Provincia es requerida.' }),
  district: z.string({ error: 'Distrito es requerido' }),
  department: z.string({ error: 'Departamento es requerido' }),
  address: z
    .string({ error: 'Dirección es requerida.' })
    .min(5, 'Dirección debe tener al menos 5 caracteres')
    .max(200, 'Dirección no puede exceder 200 caracteres')
    .transform((val) => val.trim()),
});

export const employeeSchema = z.object({
  name: z
    .string({ error: 'Nombre es requerido. ' })
    .min(2, 'Nombre debe tener al menos 2 letras')
    .max(50, 'Nombre debe tener como maximo 50 letras.')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Nombre solo puede contener letras.')
    .transform((val) => val.trim()),
  lastNameFather: z
    .string({ error: 'Apellido paterno es requerido.' })
    .min(2, 'Apellido paterno debe tener al menos 2 caracteres.')
    .max(50, 'Apellido paterno no puede exceder 50 caracteres.')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'Apellido paterno solo puede contener letras.',
    )
    .transform((val) => val.trim()),
  lastNameMother: z
    .string({ error: 'Apellido paterno es requerido' })
    .min(2, 'Apellido materno debe tener al menos 2 caracteres.')
    .max(50, 'Apellido materno no puede exceder 50 caracteres.')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      'Apellido paterno solo puede contener letras.',
    )
    .transform((val) => val.trim()),
  dni: z
    .string({ error: 'DNI es requerido.' })
    .regex(/^\d{8}$/, 'DNI debe tener exactamente 8 dígitos numéricos.')
    .transform((val) => val.trim()),
  email: z.email('El correo es requerido').trim(),
  address: z
    .string({ error: 'Dirección es requerida.' })
    .min(10, 'Dirección debe tener al menos 10 caracteres')
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
    })
    .optional(),
  salaryInWords: z
    .string({ error: 'El sueldo en letras es requerido' })
    .trim()
    .min(5, 'El sueldo en letras debe tener al menos 5 caracteres')
    .max(100, 'El sueldo en letras no puede exceder 100 caracteres')
    .optional(),
  position: z.string({ error: 'El cargo es requerido.' }).trim(),
  entryDate: z
    .union(
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
    )
    .optional(),
  endDate: z
    .union(
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
        error: 'Fecha de termino es requerida',
      },
    )
    .optional(),
  subDivisionOrParking: z.string({ error: 'sub división requerida' }).trim(),
  contractType: contractTypeSchema,
});

export const EmployeeBatchSchema = z.object({
  // CAMBIO CLAVE: 'body' ahora es directamente el array de empleados
  body: z
    .array(employeeSchema)
    .min(1, 'La lista de empleados no puede estar vacía')
    .max(80, 'Máximo 80 empleados por lote'),
});

export type EmployeeFromExcel = z.infer<typeof employeeSchema>;
export type EmployeeBatch = z.infer<typeof EmployeeBatchSchema>;
