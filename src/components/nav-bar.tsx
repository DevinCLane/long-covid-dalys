import { GitHub } from "./github-button";
import { ModeToggle } from "./mode-toggle";

export function NavBar() {
  return (
    <nav className="mb-4 flex justify-end gap-2">
      <GitHub />
      <ModeToggle />
    </nav>
  );
}
