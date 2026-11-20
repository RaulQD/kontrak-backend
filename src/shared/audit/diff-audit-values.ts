import { AuditValue, AuditValues } from './audit-entry';

type Snapshot = Record<string, AuditValue | Date | undefined>;
export const diffAuditValues = (
  before: Snapshot,
  after: Snapshot,
): { oldValues: AuditValues; newValues: AuditValues } | null => {
  const oldValues: AuditValues = {};
  const newValues: AuditValues = {};
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const antes = normalizer(before[key]);
    const despues = normalizer(after[key]);
    if (antes !== despues) {
      oldValues[key] = antes;
      newValues[key] = despues;
    }
  }
  return Object.keys(newValues).length === 0 ? null : { oldValues, newValues };
};

const normalizer = (valor: AuditValue | Date | undefined): AuditValue =>
  valor instanceof Date ? valor.toISOString() : (valor ?? null);
