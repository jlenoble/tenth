import { getKeys, AnyObject } from "../get-keys";

type Defaults = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  it: (fn: (...args: any[]) => any) => void;
};

type Test = (defaults: Defaults) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeTestSuite = <Ctor extends { new (...args: any[]): AnyObject }>(
  Class: Ctor,
  testSuite: Record<string, Test>,
  TestSuite: Record<string, Test>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initArgs: any[] = []
): void => {
  const _describe = () => {
    describe(`Test suite for ${Class.name}`, () => {
      {
        const names = getKeys(Class as AnyObject, "properties", {
          lastConstructor: Function,
          excludeKeys: ["prototype"],
        });
        const set = new Set(Object.getOwnPropertyNames(TestSuite));

        for (const name of names) {
          const title = `${Class.name}.${name}`;

          (
            (set.has(name) && TestSuite[name]) ||
            (({ title }: Defaults) => {
              it.todo(`> Write a test for ${title}`);
            })
          )({
            title,
            it: (fn) => it(title, fn),
          });
        }
      }

      {
        const obj = new Class(...initArgs);
        const names = getKeys(obj, "properties");
        const set = new Set(Object.getOwnPropertyNames(testSuite));

        for (const name of names) {
          const title = `${Class.name}.prototype.${name}`;

          (
            (set.has(name) && testSuite[name]) ||
            (({ title }: Defaults) => {
              it.todo(`> Write a test for ${title}`);
            })
          )({
            title,
            it: (fn) => it(title, fn),
          });
        }
      }
    });
  };

  return _describe();
};
