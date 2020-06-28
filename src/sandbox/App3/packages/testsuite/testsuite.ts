import { getKeys } from "../get-keys";
import {
  TestSuiteArg,
  DefaultTestOptions,
  AnyObject,
  AnyClass,
  AnyArgs,
} from "./types";
import { execIt } from "./it";

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
          execIt({ testSuite: TestSuite, name, title, set });
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
          execIt({ testSuite, name, title, set });
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
