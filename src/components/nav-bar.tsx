import ShareButton from "@/components/share-button";
import { ResetView } from "@/components/restset-view";

export function NavBar() {
  return (
    <nav className="flex justify-end gap-2">
      <ResetView />
      <ShareButton />
    </nav>
  );
}
