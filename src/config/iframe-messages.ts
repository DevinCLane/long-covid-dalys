export const PARENT_ORIGIN = "https://polybio.org";

export const TAB_IDS = ["air", "pharmaceuticals", "detailed", "about"] as const;
export type TabId = (typeof TAB_IDS)[number];

export function isTabId(value: unknown): value is TabId {
  return TAB_IDS.some((tab) => tab === value);
}
