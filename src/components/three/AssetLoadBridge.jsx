import { useProgress } from "@react-three/drei/core/Progress";
import { useEffect, useRef } from "react";

const FALLBACK_MS = 14000;

/**
 * Subscribes to THREE.DefaultLoadingManager (same as R3F useLoader).
 * Fires once when all tracked loads finish, or after FALLBACK_MS if the manager never reports.
 */
export default function AssetLoadBridge({ onTexturesReady }) {
  const { active, loaded, total } = useProgress();
  const doneRef = useRef(false);
  const cbRef = useRef(onTexturesReady);
  cbRef.current = onTexturesReady;

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      cbRef.current?.();
    }, FALLBACK_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (doneRef.current) return;
    if (!active && total > 0 && loaded >= total) {
      doneRef.current = true;
      cbRef.current?.();
    }
  }, [active, loaded, total]);

  return null;
}
