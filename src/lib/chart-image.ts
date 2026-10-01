import type { ChartMetric } from "@/components/chart-metric-toggle";
import type { ChartSortOrder } from "@/lib/chart-sort";
import { SIMULATOR_CITATION } from "@/config/citation";

export interface ChartImageDetails {
  title: string;
  description: string;
  fileName: string;
}

export function chartImageDescription(
  metric: ChartMetric,
  sortOrder: ChartSortOrder,
  selection?: string,
) {
  const metricLabel = {
    percent: "DALY reduction vs default status quo (%)",
    dalys: "DALYs per 1,000 people",
    averted: "DALYs averted per 1,000 people vs default status quo",
  }[metric];
  const orderLabel = {
    default: "Default order",
    descending: "High to low",
    ascending: "Low to high",
  }[sortOrder];

  return [selection, "5-year estimates", metricLabel, orderLabel]
    .filter(Boolean)
    .join(" · ");
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const nextLine = line ? `${line} ${word}` : word;
    if (line && context.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = nextLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function downloadChartImage(
  chart: HTMLElement,
  { title, description, fileName }: ChartImageDetails,
  assertCurrent: () => void,
) {
  // Load the exporter only when requested and wait for the chart's web font.
  const [{ toCanvas }] = await Promise.all([
    import("html-to-image"),
    document.fonts.ready,
  ]);
  assertCurrent();
  if (!chart.isConnected || chart.clientWidth === 0) {
    throw new Error("The chart is no longer visible.");
  }

  const cardStyle = getComputedStyle(
    chart.closest('[data-slot="card"]') ?? chart,
  );
  const background = cardStyle.backgroundColor;
  const foreground = cardStyle.color;
  const chartStyle = getComputedStyle(chart);
  const fontFamily = chartStyle.fontFamily;
  const citationColor =
    chartStyle.getPropertyValue("--muted-foreground").trim() || foreground;
  const pixelRatio = 2;
  const chartCanvas = await toCanvas(chart, {
    pixelRatio,
    backgroundColor: background,
    preferredFontFormat: "woff2",
    filter: (node) =>
      !(node instanceof Element) ||
      (!node.classList.contains("recharts-tooltip-wrapper") &&
        !node.classList.contains("recharts-tooltip-cursor")),
  });

  // Add a compact header without exporting interactive controls or panels.
  const padding = 24;
  const width = chartCanvas.width / pixelRatio + padding * 2;
  const titleSize = width < 500 ? 18 : 24;
  const titleLineHeight = titleSize * 1.4;
  const descriptionLineHeight = 20;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Image export is unavailable.");

  context.font = `600 ${titleSize}px ${fontFamily}`;
  const titleLines = wrapText(context, title, width - padding * 2);
  context.font = `400 13px ${fontFamily}`;
  const descriptionLines = wrapText(context, description, width - padding * 2);
  const citationLineHeight = 16;
  context.font = `400 11px ${fontFamily}`;
  const citationLines = wrapText(
    context,
    SIMULATOR_CITATION,
    width - padding * 2,
  );
  const chartTop =
    padding +
    titleLines.length * titleLineHeight +
    8 +
    descriptionLines.length * descriptionLineHeight +
    20;
  const chartBottom = chartTop + chartCanvas.height / pixelRatio;
  const citationTop = chartBottom + 24;

  canvas.width = Math.ceil(width * pixelRatio);
  canvas.height = Math.ceil(
    (citationTop + citationLines.length * citationLineHeight + padding) *
      pixelRatio,
  );
  context.scale(pixelRatio, pixelRatio);
  context.fillStyle = background;
  context.fillRect(0, 0, width, canvas.height / pixelRatio);
  context.fillStyle = foreground;
  context.textBaseline = "top";
  context.font = `600 ${titleSize}px ${fontFamily}`;
  titleLines.forEach((line, index) =>
    context.fillText(line, padding, padding + index * titleLineHeight),
  );
  context.font = `400 13px ${fontFamily}`;
  descriptionLines.forEach((line, index) =>
    context.fillText(
      line,
      padding,
      padding +
        titleLines.length * titleLineHeight +
        8 +
        index * descriptionLineHeight,
    ),
  );
  context.drawImage(
    chartCanvas,
    padding,
    chartTop,
    chartCanvas.width / pixelRatio,
    chartCanvas.height / pixelRatio,
  );
  context.strokeStyle = citationColor;
  context.globalAlpha = 0.2;
  context.beginPath();
  context.moveTo(padding, chartBottom + 12);
  context.lineTo(width - padding, chartBottom + 12);
  context.stroke();
  context.globalAlpha = 1;
  context.fillStyle = citationColor;
  context.font = `400 11px ${fontFamily}`;
  citationLines.forEach((line, index) =>
    context.fillText(line, padding, citationTop + index * citationLineHeight),
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error("The image could not be generated."));
    }, "image/png");
  });
  // Avoid downloading a chart with a title from an earlier view or model state.
  assertCurrent();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.png`;
  document.body.append(link);
  link.click();
  link.remove();
  // Give the browser time to start the download before releasing the image.
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
