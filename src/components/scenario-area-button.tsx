import { Button } from "@/components/ui/button";

interface ScenarioAreaButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

// takes in the selected scenario state
export function ScenarioAreaButton({
  label,
  onClick,
  className,
}: ScenarioAreaButtonProps) {
  // removed everything from selected scenario when checked?
  return (
    <Button onClick={onClick} className={className}>
      {label}
    </Button>
  );
}
