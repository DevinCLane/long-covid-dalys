export const CHART_SORT_ORDERS = [
  "default",
  "descending",
  "ascending",
] as const;
export type ChartSortOrder = (typeof CHART_SORT_ORDERS)[number];

export function isChartSortOrder(value: unknown): value is ChartSortOrder {
  return CHART_SORT_ORDERS.some((sortOrder) => sortOrder === value);
}

export interface ChartSortProps {
  sortOrder: ChartSortOrder;
  setSortOrder: (value: ChartSortOrder) => void;
}

export function sortChartRows<T>(
  rows: readonly T[],
  sortOrder: ChartSortOrder,
  getValue: (row: T) => number,
): T[] {
  // Copy before sorting so reset and other charts retain their original order.
  const sortedRows = [...rows];
  if (sortOrder === "default") return sortedRows;

  const direction = sortOrder === "ascending" ? 1 : -1;
  return sortedRows.sort((a, b) => direction * (getValue(a) - getValue(b)));
}
