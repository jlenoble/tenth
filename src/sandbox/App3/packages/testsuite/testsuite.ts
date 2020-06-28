import { getKeys, AnyObject } from "../get-keys";
import { Test, DefaultTestOptions } from "./types";

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
            (({ title }: DefaultTestOptions) => {
              it.todo(`> Write a test for ${title}`);
            })
          )({
            title,
            it: (fn) => it(title, fn),
          });

          set.delete(name);
        }

        for (const name of set) {
          it.todo(`Remove Testsuite.${name} or add ${Class.name}.${name}`);
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
            (({ title }: DefaultTestOptions) => {
              it.todo(`> Write a test for ${title}`);
            })
          )({
            title,
            it: (fn) => it(title, fn),
          });

          set.delete(name);
        }

        for (const name of set) {
          it.todo(
            `Remove testsuite.${name} or add ${Class.name}.prototype.${name}`
          );
        }
      }
    });
  };

  return _describe();
};
