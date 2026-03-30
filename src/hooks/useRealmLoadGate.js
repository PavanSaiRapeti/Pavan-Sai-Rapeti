import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEFAULT_REALM_SWEEP_MS,
  MIN_REALM_SWEEP_MS,
  REALM_FORCE_REVEAL_MS,
} from "../config/loading";
import { clampPercent0to100 } from "../utils/percent";

/**
 * Coordinates timed loading overlay (0→100%) with Scene asset readiness.
 * @param {number} minSweepMs effective sweep length after clamps
 */
export function useRealmLoadGate(minSweepMs) {
  const [realmReady, setRealmReady] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const assetsReadyRef = useRef(false);

  const onAssetsLoaded = useCallback(() => {
    assetsReadyRef.current = true;
  }, []);

  useEffect(() => {
    if (realmReady) return;
    let cancelled = false;
    const start = performance.now();
    let raf = 0;

    setLoadPercent(0);

    const tick = () => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const raw = Math.min(100, (elapsed / minSweepMs) * 100);
      const next = clampPercent0to100(Math.floor(raw));
      setLoadPercent(next);

      const sweepDone = elapsed >= minSweepMs;
      const canReveal = assetsReadyRef.current && sweepDone;

      if (canReveal || elapsed >= REALM_FORCE_REVEAL_MS) {
        setLoadPercent(100);
        setRealmReady(true);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [realmReady, minSweepMs]);

  return { realmReady, loadPercent, onAssetsLoaded };
}

/** Resolve sweep ms from staticText.loading + shared defaults. */
export function resolveRealmSweepMs(staticTextLoading) {
  const fromJson = Number(staticTextLoading?.minSweepMs);
  return Math.max(
    MIN_REALM_SWEEP_MS,
    Number.isFinite(fromJson) && fromJson > 0 ? fromJson : DEFAULT_REALM_SWEEP_MS
  );
}
