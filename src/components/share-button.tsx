import { SiBluesky, SiX } from "@icons-pack/react-simple-icons";
import { Mail, Forward } from "lucide-react";
import { RxLinkedinLogo } from "react-icons/rx";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CopyableInput from "@/components/copyable-input";

export default function ShareButton() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-col gap-4">
        <Popover>
          <Tooltip>
            <PopoverTrigger asChild>
              <TooltipTrigger asChild>
                <Button
                  className="bg-card"
                  variant="outline"
                  aria-label="Share options"
                >
                  <Forward />
                </Button>
              </TooltipTrigger>
            </PopoverTrigger>
            <TooltipContent className="px-2 py-1 text-xs">Share</TooltipContent>
          </Tooltip>

          <PopoverContent className="w-72 bg-card">
            <div className="flex flex-col gap-3 text-center">
              <div className="text-sm font-medium">Share</div>
              <div className="flex flex-wrap justify-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-card"
                      asChild
                      size="icon"
                      variant="outline"
                      aria-label="Share on BlueSky"
                    >
                      <a
                        href="https://bsky.app/intent/compose?text=https%3A%2F%2Flongcoviddalys.netlify.app%2F%20%40devinlane.com"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <SiBluesky size={16} aria-hidden="true" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Share on BlueSky
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-card"
                      asChild
                      size="icon"
                      variant="outline"
                      aria-label="Share on LinkedIn"
                    >
                      <a
                        href="https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=https%3A%2F%2Flongcoviddalys.netlify.app%2F"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <RxLinkedinLogo aria-hidden="true" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Share on LinkedIn
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-card"
                      asChild
                      size="icon"
                      variant="outline"
                      aria-label="Share on X"
                    >
                      <a
                        href="https://x.com/intent/post?text=https%3A%2F%2Flongcoviddalys.netlify.app%2F%20%40DevinCLane"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <SiX aria-hidden="true" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Share on X
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-card"
                      asChild
                      title="Share via email"
                      size="icon"
                      variant="outline"
                      aria-label="Share via email"
                    >
                      <a
                        href="mailto:?subject=Long Covid DALYs website&amp;body=https://longcoviddalys.netlify.app/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Mail size={16} aria-hidden="true" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">
                    Share via email
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Copy URL to clipboard</div>
                <CopyableInput
                  copyableInput="https://longcoviddalys.netlify.app/"
                  ariaLabel="url"
                />
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Copy Citation to clipboard
                </div>
                <CopyableInput
                  copyableInput="Cohen AK, Jaudon TW, Cho O, Lane DC, Vogel JM. Benefits of air cleaning interventions on COVID-19 infection and Long COVID-related disability-adjusted life years: A policy simulation."
                  ariaLabel="citation"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}
