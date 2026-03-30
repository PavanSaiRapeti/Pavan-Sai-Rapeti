/** Default full duration of the timed 0→100% overlay sweep (ms). */
export const DEFAULT_REALM_SWEEP_MS = 3200;

/** Never dismiss the loader before this many ms (guards bad JSON / zero). */
export const MIN_REALM_SWEEP_MS = 400;

/** Hard cap: dismiss overlay even if assets never signal (ms). */
export const REALM_FORCE_REVEAL_MS = 45000;
