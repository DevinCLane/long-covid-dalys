import { useSyncExternalStore } from "react";

// Match Tailwind's md breakpoint so interactions follow the responsive layout.
const DESKTOP_QUERY = "(min-width: 48rem)";

function subscribe(onChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getSnapshot() {
  return !window.matchMedia(DESKTOP_QUERY).matches;
}

function getServerSnapshot() {
  return true;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
