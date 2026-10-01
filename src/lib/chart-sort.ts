export type ChartSortOrder = "default" | "descending" | "ascending";

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
