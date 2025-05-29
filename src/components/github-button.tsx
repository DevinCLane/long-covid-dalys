import { Button } from "@/components/ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";

export function GitHub() {
  return (
    <Button
      asChild
      title="View source code on GitHub"
      variant="outline"
      size="icon"
    >
      <a
        href="https://github.com/DevinCLane/long-covid-dalys"
        target="_blank"
        rel="noreferrer"
      >
        <SiGithub />
      </a>
    </Button>
  );
}
