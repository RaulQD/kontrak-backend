import { SCTR_RISK_LEVELS } from '../constants/positions';

export const getRiskLevelByPosition = (position: string): string | null => {
  if (!position) return null;
  const normalizePosition = position.toUpperCase().trim();
  const riskLevel = SCTR_RISK_LEVELS[normalizePosition];
  if (!riskLevel) return null;
  return `${riskLevel} RIESGO`;
};
