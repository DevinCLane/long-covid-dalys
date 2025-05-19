import { ModeToggle } from "./mode-toggle";

export function NavBar() {
  return (
    <nav className="flex justify-end pb-4">
      <ModeToggle />
    </nav>
  );
}
