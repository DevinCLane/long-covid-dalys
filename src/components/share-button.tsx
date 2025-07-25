import { useId, useRef, useState } from "react";
import { SiBluesky, SiX } from "@icons-pack/react-simple-icons";
import { CheckIcon, CopyIcon, Mail, Forward } from "lucide-react";
import { RxLinkedinLogo } from "react-icons/rx";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function ShareButton() {
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

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
                      {/* todo: tag myself? */}
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
                <div className="relative">
                  <Input
                    ref={inputRef}
                    id={id}
                    className="bg-card pe-9"
                    type="text"
                    defaultValue="https://longcoviddalys.netlify.app/"
                    aria-label="Share link"
                    readOnly
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleCopy}
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed"
                        aria-label={copied ? "Copied" : "Copy to clipboard"}
                        disabled={copied}
                      >
                        <div
                          className={cn(
                            "transition-all",
                            copied
                              ? "scale-100 opacity-100"
                              : "scale-0 opacity-0",
                          )}
                        >
                          <CheckIcon
                            className="stroke-emerald-500"
                            size={16}
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className={cn(
                            "absolute transition-all",
                            copied
                              ? "scale-0 opacity-0"
                              : "scale-100 opacity-100",
                          )}
                        >
                          <CopyIcon size={16} aria-hidden="true" />
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="px-2 py-1 text-xs">
                      Copy to clipboard
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TooltipProvider>
  );
}
