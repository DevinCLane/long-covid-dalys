import { useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyableInputProps {
  copyableInput: string;
  ariaLabel: string;
}

export default function CopyableInput({
  copyableInput,
  ariaLabel,
}: CopyableInputProps) {
  const id = useId();
  const [copied, setCopied] = useState<boolean>(false);
  const [copying, setCopying] = useState(false);
  const [status, setStatus] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (!inputRef.current || copying || copied) return;
    setCopying(true);
    setStatus("");
    try {
      await navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setStatus(`${ariaLabel} copied to clipboard.`);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setStatus(
        `Couldn't copy ${ariaLabel}. Select the text and copy it manually.`,
      );
    } finally {
      setCopying(false);
    }
  };

  return (
    <div>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          className="bg-card truncate pe-9"
          type="text"
          value={copyableInput}
          aria-label={ariaLabel}
          readOnly
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handleCopy}
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md outline-hidden transition-[color,box-shadow] focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
              aria-label={`Copy ${ariaLabel} to clipboard`}
              aria-disabled={copied || copying}
            >
              <div
                className={cn(
                  "transition-all",
                  copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
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
                  copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                )}
              >
                <CopyIcon size={16} aria-hidden="true" />
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent className="px-2 py-1 text-xs">
            Copy {ariaLabel.toLowerCase()} to clipboard
          </TooltipContent>
        </Tooltip>
      </div>
      <p role="status" aria-atomic="true" className="mt-1 text-left text-xs">
        {status}
      </p>
    </div>
  );
}
