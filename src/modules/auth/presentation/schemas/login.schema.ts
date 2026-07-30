import z from 'zod';

export const emailValidator = z.email('Correo electrónico no válido');

export const loginSchema = z.object({
  body: z.object({
    email: emailValidator,
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(72, 'La contraseña no debe superar los 72 caracteres'),
  }),
});
export type LoginInput = z.infer<typeof loginSchema>;
