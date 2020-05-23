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
