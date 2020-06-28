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
      it.todo(`> Write a test for ${title}`);
    });

  test({
    title,
    it: (fn) => it(title, fn),
  });
};
