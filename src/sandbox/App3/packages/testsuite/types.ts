export type DefaultTestOptions = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  it: (fn: (...args: any[]) => any) => void;
};

export type Test = (options: DefaultTestOptions) => void;
