import { Button } from "@/components/ui/button";

interface ResetScenariosButtonProps {
  onClick: () => void;
}

// takes in the selected scenario state
export function ResetScenariosButton({ onClick }: ResetScenariosButtonProps) {
  // removed everything from selected scenario when checked?
  return <Button onClick={onClick}>Reset scenarios</Button>;
}
