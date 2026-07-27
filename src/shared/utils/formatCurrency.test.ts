import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formatea un monto en soles con 2 decimales', () => {
    // ⚠️ OJO: el separador tras "S/" es un espacio NO-rompible (\u00A0),
    // NO un espacio normal. Si escribes "S/ 1,130.00" con espacio común, FALLA.
    expect(formatCurrency(1130)).toBe('S/\u00A01,130.00');
  });

  it('formatea cero', () => {
    expect(formatCurrency(0)).toBe('S/\u00A00.00');
  });

  it('agrupa los miles con coma', () => {
    // Alternativa ROBUSTA: no dependemos del tipo de espacio,
    // solo verificamos que el número esté bien agrupado.
    expect(formatCurrency(1234567.5)).toContain('1,234,567.50');
  });
});
