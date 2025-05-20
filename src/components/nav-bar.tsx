import { GitHub } from "./github-button";
import { ModeToggle } from "./mode-toggle";

export function NavBar() {
  return (
    <nav className="flex justify-end gap-2 pb-4">
      <GitHub />
      <ModeToggle />
    </nav>
  );
}
