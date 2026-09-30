import { ResetView } from "./reset-view";
import ShareButton from "./share-button";

export function Header({ resetView }: { resetView: () => void }) {
  return (
    <header className="pb-4 md:pt-2 md:pb-6 lg:pt-4 lg:pb-10">
      <div className="flex items-center gap-2">
        <h1 className="text-leg min-w-0 flex-1 scroll-m-20 text-lg font-extrabold tracking-tight sm:text-center sm:text-2xl md:text-4xl lg:text-5xl">
          COVID-19 DALYs Simulator
        </h1>

        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          <ResetView resetView={resetView} />
          <ShareButton />
        </div>
      </div>
    </header>
  );
}
