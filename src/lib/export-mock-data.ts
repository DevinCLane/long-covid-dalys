import { writeFileSync } from "node:fs";

interface ChartDataItem {
  date: string;
  dalys: number;
  [key: string]: number | string;
}

/**
 * Generates the baseline chart data for Long COVID DALYs.
 * Starts with 17 million cases and reduces by 2% each year.
 * Each case contributes 80 DALYs per 1,000 people.
 */
const generateChartDataItems = () => {
  const data: ChartDataItem[] = [];
  let baselineCases = 17000000; // Starting with 17M cases
  const yearlyReduction = 0.98; // 2% reduction per year
  // 80 DALYs per 1k people with LC
  const dalysPer1000People = 80;

  for (let year = 2025; year <= 2125; year++) {
    // convert LC cases to DALYs
    const totalDalys = (baselineCases * dalysPer1000People) / 1000;
    data.push({
      date: `${year}-01-01`,
      dalys: Math.round(totalDalys),
    });
    baselineCases *= yearlyReduction; // Reduce by 2% each year
  }
  return data;
};

const chartDataItems = generateChartDataItems();

// Write to both locations for backwards compatibility
writeFileSync("./src/data/dalys.json", JSON.stringify(chartDataItems, null, 2));

console.log("✅ Generated baseline DALY data and saved to src/data/dalys.json");
console.log(`   Generated ${chartDataItems.length} data points from 2025-2125`);
