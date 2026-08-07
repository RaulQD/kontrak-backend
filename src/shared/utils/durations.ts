const UNITS = {
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
} as const;
export const toSeconds = (value: string): number => {
  const match = /^(\d+)([smhd])?$/.exec(value.trim());
  if (!match) {
    throw new Error(`Duración inválida: ${value}`);
  }
  const amout = Number(match[1]);
  const unit = (match[2] ?? 's') as keyof typeof UNITS;
  return amout * UNITS[unit];
};
