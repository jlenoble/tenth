import { Test, TestSuiteArg, DefaultTestOptions } from "./types";

export const execIt = ({
  testSuite,
  name,
  title,
  set,
}: {
  testSuite: TestSuiteArg;
  name: string;
  title: string;
  set: Set<string>;
}): void => {
  const test: Test =
    (set.has(name) && testSuite[name]) ||
    (({ title }: DefaultTestOptions) => {
      it.todo(`Write a test for "${title}"`);
    });

  test({
    title,
    it: (fn) => it(title, fn),
  });
};

export const execIts = ({
  testSuite,
  names,
  title,
}: {
  testSuite: TestSuiteArg;
  names: string[];
  title: (name: string) => string;
}): void => {
  const set = new Set(Object.getOwnPropertyNames(testSuite));

  for (const name of names) {
    execIt({ testSuite, name, title: title(name), set });
    set.delete(name);
  }

  for (const name of set) {
    it.todo(
      `Either add/implement "${title(
        name
      )}" or remove/spread "${name}" from/into test suite `
    );
  }
};
