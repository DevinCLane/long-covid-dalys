export function SiteFooter() {
    return (
        <footer className="border-grid border-t py-6 md:px-8 md:py-0">
            <div className="container-wrapper">
                <div className="container py-4">
                    <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by{" "}
                        <a
                            href="devinlane.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Devin Lane
                        </a>
                        , components from{" "}
                        <a
                            href="https://ui.shadcn.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            Shadcn
                        </a>
                        . Source code available on{" "}
                        <a
                            href="devinlane.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium underline underline-offset-4"
                        >
                            GitHub
                        </a>
                        .
                    </div>
                </div>
            </div>
        </footer>
    );
}
