import { Test, TestSuite, DefaultTestOptions } from "./types";
import { isPrimitiveObjectProperty } from "../is-property";

export const execIt = ({
  testSuite,
  name,
  title,
  set,
}: {
  testSuite: TestSuite;
  name: string;
  title: string;
  set: Set<string>;
}): void => {
  const test: Test =
    (set.has(name) && testSuite[name]) ||
    (testSuite[name] === false &&
      (() => {
        // no-op
      })) ||
    (isPrimitiveObjectProperty(name) &&
      (({ title }: DefaultTestOptions) => {
        it.todo(
          `Write a test for overridden primitive property "${title}" with consistent signature`
        );
      })) ||
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
  remainingNames,
}: {
  testSuite: TestSuite;
  names: string[];
  title: (name: string) => string;
  remainingNames: Set<string>;
}): void => {
  for (const name of names) {
    execIt({ testSuite, name, title: title(name), set: remainingNames });
    remainingNames.delete(name);
  }
};
