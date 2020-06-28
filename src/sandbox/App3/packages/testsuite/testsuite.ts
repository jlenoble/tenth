import { getKeys } from "../get-keys";
import {
  TestSuiteArg,
  DefaultTestOptions,
  AnyObject,
  AnyClass,
  AnyArgs,
} from "./types";

export const makeTestSuite = <Ctor extends AnyClass>(
  Class: Ctor,
  testSuite: TestSuiteArg,
  TestSuite: TestSuiteArg,
  initArgs: AnyArgs = []
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
