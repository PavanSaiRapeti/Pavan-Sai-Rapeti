/**
 * Clamp a value to an integer percentage in [0, 100].
 * Safe for string-ish props from JSON or query params.
 */
export function clampPercent0to100(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}
