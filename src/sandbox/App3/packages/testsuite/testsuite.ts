import { getKeys } from "../get-keys";
import { TestSuiteArg, AnyObject, AnyClass, AnyArgs } from "./types";
import { execIts } from "./it";

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

        execIts({
          testSuite: TestSuite,
          names,
          title: (name: string) => `${Class.name}.${name}`,
        });
      }

      {
        const obj = new Class(...initArgs);
        const names = getKeys(obj, "properties");

        execIts({
          testSuite,
          names,
          title: (name: string) => `${Class.name}.prototype.${name}`,
        });
      }
    });
  };

  return _describe();
};
