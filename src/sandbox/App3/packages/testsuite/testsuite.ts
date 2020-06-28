import { getKeys } from "../get-keys";
import { TestSuite, AnyObject, AnyClass, AnyArgs } from "./types";
import { execIts } from "./it";

export const makeTestSuite = <Ctor extends AnyClass>(
  Class: Ctor,
  testSuite: TestSuite,
  staticTestSuite: TestSuite,
  initArgs: AnyArgs = []
): void => {
  const _describe = () => {
    describe(`Test suite for ${Class.name}`, () => {
      let remainingNames = new Set(Object.getOwnPropertyNames(staticTestSuite));

      {
        const names = getKeys(Class as AnyObject, "properties", {
          lastConstructor: Function,
          excludeKeys: ["prototype"],
        });

        execIts({
          testSuite: staticTestSuite,
          names,
          title: (name: string) => `${Class.name}.${name}`,
          remainingNames,
        });
      }

      for (const name of remainingNames) {
        it.todo(
          `Either add/implement "${Class.name}.${name}" or remove/spread "${name}" from/into static test suite `
        );
      }

      const obj = new Class(...initArgs);
      remainingNames = new Set(Object.getOwnPropertyNames(testSuite));

      {
        const names = getKeys(obj, "attributes");

        execIts({
          testSuite,
          names,
          title: (name: string) =>
            `${
              Class.name[0].toLowerCase() + Class.name.slice(1)
            }Instance.${name}`,
          remainingNames,
        });
      }

      {
        const names = getKeys(obj, "states");

        execIts({
          testSuite,
          names,
          title: (name: string) =>
            `non enumerable ${
              Class.name[0].toLowerCase() + Class.name.slice(1)
            }Instance.${name}`,
          remainingNames,
        });
      }

      {
        const names = getKeys(obj, "methods");

        execIts({
          testSuite,
          names,
          title: (name: string) => `${Class.name}.prototype.${name}`,
          remainingNames,
        });
      }

      for (const name of remainingNames) {
        it.todo(
          `Either add "${
            Class.name[0].toLowerCase() + Class.name.slice(1)
          }Instance.${name}" or implement "${
            Class.name
          }.prototype.${name}" or remove/spread "${name}" from/into instance test suite `
        );
      }
    });
  };

  return _describe();
};
