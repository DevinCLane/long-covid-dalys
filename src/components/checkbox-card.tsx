import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";

const CheckboxCard = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "text-muted-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary/4 data-[state=checked]:text-primary relative cursor-pointer rounded-lg border border-dashed px-4 py-3 text-start data-[state=checked]:border-solid data-[state=checked]:ring dark:data-[state=checked]:ring-transparent",
        className,
      )}
    >
      <span className="font-medium tracking-tight">{label}</span>

      <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
        <CircleCheck className="fill-primary text-primary-foreground" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

export default CheckboxCard;
