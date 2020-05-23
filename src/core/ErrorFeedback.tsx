import React, { FunctionComponent, useState } from "react";
import { Alert, AlertTitle } from "@material-ui/lab";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = any[];

export type CatchError = (
  fn: (...args: Args) => Promise<void> | void
) => (...args: Args) => void;

export const makeCatchError = (setError: (e: Error) => void): CatchError => (
  fn: (...args: Args) => Promise<void> | void
) => (...args: Args): void => {
  try {
    const res = fn(...args);
    if (res instanceof Promise) {
      res.catch((e) => setError(e));
    }
  } catch (e) {
    setError(e);
  }
};

export const makeErrorFeedBack: (error: Error) => FunctionComponent = (
  error: Error
): FunctionComponent => {
  const ErrorFeedback: FunctionComponent = () => {
    return (
      <Alert
        variant="outlined"
        severity="error"
        onClose={(): void => {
          console.log("close");
        }}
      >
        <AlertTitle>{error.message}</AlertTitle>
      </Alert>
    );
  };

  return ErrorFeedback;
};

export const useErrorFeedback = (): {
  ErrorFeedback: FunctionComponent | null;
  catchError: CatchError;
} => {
  const [error, setError] = useState<Error | null>(null);
  const catchError = makeCatchError(setError);

  return { ErrorFeedback: error && makeErrorFeedBack(error), catchError };
};
