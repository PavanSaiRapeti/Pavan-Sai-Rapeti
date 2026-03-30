import { useEffect, useState } from "react";

/** True when `useMobilePortraitGate` has set `body[data-mobile-landscape="1"]`. */
export function useMobileLandscapeActive() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () =>
      setActive(document.body?.dataset?.mobileLandscape === "1");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-mobile-landscape"],
    });
    return () => obs.disconnect();
  }, []);

  return active;
}
