export function SiteFooter() {
    return (
        <footer className="p-6">
            <div className="container-wrapper">
                <div className="container py-4">
                    <div className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                        <p>
                            From the paper "Modeling Disability-Adjusted Life
                            Years Post-COVID Infection: Estimating the Impacts
                            of Long COVID and Other Post-COVID Consequences
                        </p>
                        <p>
                            Alison Cohen (principal investigator), Julia Moore
                            Vogel (co-principal investigator), & Katie Bach
                            (co-principal investigator)
                        </p>
                        Website by{" "}
                        <a
                            href="https://www.devinlane.com/"
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
                            shadcn
                        </a>
                        . Source code available on{" "}
                        <a
                            href="https://github.com/DevinCLane/long-covid-dalys"
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
