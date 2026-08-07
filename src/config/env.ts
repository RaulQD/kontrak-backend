import 'dotenv/config';
import { z } from 'zod';
import { toSeconds } from '../shared/utils/durations';

/**
 * Validación de variables de entorno con fail-fast.
 *
 * Si falta o es inválida una variable crítica, el proceso muere al ARRANCAR
 * con un mensaje claro — nunca esperando a la primera request.
 * Solo se loguea el NOMBRE de la variable y el motivo, jamás el valor.
 */
const EnvSchema = z.object({
  // ── App ──
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  HOST: z.string().default('localhost'),

  // ── Base de datos ──
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL es obligatoria')
    .regex(
      /^postgres(ql)?:\/\//,
      'DATABASE_URL debe ser una URL postgresql://',
    ),

  // ── Redis (BullMQ) — aún no se usa; opcional por ahora ──
  REDIS_URL: z.string().optional(),

  // ── Autenticación / JWT (se activa al construir auth, US-007) ──
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET debe tener al menos 32 caracteres'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET debe tener al menos 32 caracteres'),
  JWT_ACCESS_EXPIRES: z.string().default('15m').transform(toSeconds), // → 900
  JWT_REFRESH_EXPIRES: z.string().default('7d').transform(toSeconds), // → 604800
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas o faltantes:');
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

/** Entorno validado y tipado. Importa SIEMPRE `env` en vez de `process.env`. */
export const env = parsed.data;
