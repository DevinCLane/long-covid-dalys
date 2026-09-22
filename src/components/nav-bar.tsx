import ShareButton from "@/components/share-button";
import { ResetView } from "@/components/reset-view";

export function NavBar({ resetView }: { resetView: () => void }) {
  return (
    <nav className="flex justify-end gap-2">
      <ResetView resetView={resetView} />
      <ShareButton />
    </nav>
  );
}
