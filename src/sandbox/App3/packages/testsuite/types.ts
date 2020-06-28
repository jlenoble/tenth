export type DefaultTestOptions = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  it: (fn: (...args: any[]) => any) => void;
};

export type Test = (options: DefaultTestOptions) => void;

export interface AnyObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyArgs = any[];

export interface AnyClass {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): AnyObject;
}

export type TestSuite = Record<string, Test>;
