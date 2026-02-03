import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function WorkInProgressAlert() {
  const date = new Date();
  const localDate = new Intl.DateTimeFormat(navigator.language).format(date);
  return (
    <Alert className="bg-card mb-4 self-center">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription className="justify-items-center">
        This is a work in progress and currently displaying test data as of{" "}
        {localDate}
      </AlertDescription>
    </Alert>
  );
}
