import { Button } from "@/components/ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function GitHub() {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="bg-card"
            asChild
            variant="outline"
            size="icon"
            aria-label="View source code on GitHub"
          >
            <a
              href="https://github.com/DevinCLane/long-covid-dalys"
              target="_blank"
              rel="noreferrer"
            >
              <SiGithub />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">
          View source code on GitHub
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
