import { createContext, useContext } from "react";

export const RealmCursorContext = createContext(null);

export function useRealmPlayKick() {
  const ctx = useContext(RealmCursorContext);
  return ctx?.playKick ?? (() => {});
}
