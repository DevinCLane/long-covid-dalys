import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function WorkInProgressAlert() {
  const date = new Date();
  const localDate = new Intl.DateTimeFormat(navigator.language).format(date);
  return (
    <Alert className="self-center bg-accent lg:max-w-7xl">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        This is a work in progress and currently displaying test data as of{" "}
        {localDate}
      </AlertDescription>
    </Alert>
  );
}
