import { GitHub } from "@/components/github-button";
import { DarkLightToggle } from "@/components/dark-light-mode-toggle";
import ShareButton from "@/components/share-button";

export function NavBar() {
  return (
    <nav className="mb-4 flex justify-end gap-2">
      <GitHub />
      <ShareButton />
      <DarkLightToggle />
    </nav>
  );
}
