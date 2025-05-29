import { GitHub } from "./github-button";
import { ModeToggle } from "./mode-toggle";
import ShareButton from "./share-button";

export function NavBar() {
  return (
    <nav className="mb-4 flex justify-end gap-2">
      <GitHub />
      <ShareButton />
      <ModeToggle />
    </nav>
  );
}
