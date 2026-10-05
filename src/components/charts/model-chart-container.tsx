import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Bar } from "recharts";

import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { useDalyModel } from "@/hooks/use-daly-model";
import { downloadChartImage, type ChartImageDetails } from "@/lib/chart-image";
import { cn } from "@/lib/utils";
import {
  ChartResultsStatus,
  type ChartResultsStatusProps,
} from "./chart-results-status";

const ChartAnimationContext = createContext<{
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
} | null>(null);

export function ModelBar(props: ComponentProps<typeof Bar>) {
  const animation = useContext(ChartAnimationContext);
  if (!animation)
    throw new Error("ModelBar must be inside ModelChartContainer");
  return <Bar {...props} {...animation} />;
}

export function ModelChartContainer({
  className,
  children,
  image,
  accessibleData,
  ...props
}: ComponentProps<typeof ChartContainer> & {
  image: ChartImageDetails;
  accessibleData: Pick<
    ChartResultsStatusProps,
    "rows" | "valueLabel" | "showPercent"
  >;
}) {
  const { isCustomScenario } = useDalyModel();
  const chartRef = useRef<HTMLDivElement>(null);
  const downloadingRef = useRef(false);
  const exportVersionRef = useRef(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState("");
  // Keep animation state here so updating the button doesn't recreate chart data.
  const onAnimationStart = useCallback(() => setIsAnimating(true), []);
  const onAnimationEnd = useCallback(() => setIsAnimating(false), []);
  const animation = useMemo(
    () => ({ onAnimationStart, onAnimationEnd }),
    [onAnimationStart, onAnimationEnd],
  );
  useEffect(() => {
    exportVersionRef.current += 1;
  }, [children, image.title, image.description, image.fileName, isAnimating]);

  async function handleDownload() {
    if (!chartRef.current || downloadingRef.current || isAnimating) return;
    const chart = chartRef.current;
    const exportVersion = exportVersionRef.current;
    downloadingRef.current = true;
    setIsDownloading(true);
    setError(null);
    setDownloadStatus("Preparing chart image.");
    try {
      await downloadChartImage(chart, image, () => {
        if (
          chartRef.current !== chart ||
          exportVersionRef.current !== exportVersion
        ) {
          throw new Error("The chart changed while preparing the image.");
        }
      });
      setDownloadStatus("Chart image download started.");
    } catch {
      setDownloadStatus("");
      setError("Couldn't download the image. Please try again.");
    } finally {
      downloadingRef.current = false;
      setIsDownloading(false);
    }
  }

  return (
    <div className="order-2 w-full">
      <div
        ref={chartRef}
        className={cn("relative isolate container", className)}
      >
        {isCustomScenario && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
          >
            <div className="text-foreground absolute top-1/2 right-[3%] left-[24%] -translate-y-1/2 -rotate-12 text-center opacity-12 dark:opacity-15">
              <p className="text-[clamp(1rem,5cqw,3.5rem)] leading-none font-semibold tracking-[0.06em] uppercase">
                Custom scenario
              </p>
              <p className="mt-3 pr-[12%] text-right text-[clamp(0.625rem,1.8cqw,1rem)] font-medium tracking-[0.3em] uppercase">
                Not validated
              </p>
            </div>
          </div>
        )}
        {/* The translucent watermark sits above the bars without blocking interactions. */}
        <ChartAnimationContext.Provider value={animation}>
          <ChartContainer {...props} className="relative z-10 h-full w-full">
            {children}
          </ChartContainer>
        </ChartAnimationContext.Provider>
      </div>
      <ChartResultsStatus
        {...accessibleData}
        description={image.description}
        isCustomScenario={isCustomScenario}
      />
      <div className="mt-3 flex flex-col items-end gap-2">
        <p role="status" className="sr-only">
          {downloadStatus}
        </p>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          disabled={isDownloading || isAnimating}
          aria-label={`Download image of ${image.title}`}
          aria-busy={isDownloading}
          onClick={handleDownload}
        >
          {isDownloading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Download />
          )}
          {isDownloading ? "Preparing image…" : "Download image"}
        </Button>
        {error && (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
