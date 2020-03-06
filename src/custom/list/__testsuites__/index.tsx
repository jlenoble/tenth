import React, { ReactElement } from "react";
import { RenderOptions, RenderResult } from "@testing-library/react";
import {
  StatelessListWithDefaults,
  StatefulListWithDefaults,
  Props
} from "../ListFactory";

type Render<R> = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => RenderResult & R;

type TestOptions<R> = { ui: ReactElement; render: Render<R> };

export type Test<R> =
  | ((options: TestOptions<R>) => void)[]
  | ((options: TestOptions<R>) => void);

export function statelessListTestSuite<R>({
  Component,
  propList = [],
  test,
  render
}: {
  Component: StatelessListWithDefaults;
  propList: Props[];
  test?: Test<R>;
  render: Render<R>;
}) {
  describe(`${Component.displayName} renders without crashing`, () => {
    if (!test) {
      it("with no props", () => {
        render(<Component />);
      });
    }

    propList.forEach(({ defaultItems, ...props }, i) => {
      it(`with props propList[${i}]`, () => {
        const itemHooks = { items: defaultItems };

        if (Array.isArray(test)) {
          test = test[i];
        }

        if (typeof test === "function") {
          test({
            ui: <Component itemHooks={itemHooks} {...props} />,
            render
          });
        }
      });
    });
  });
}

export function statefulListTestSuite<R>({
  Component,
  propList = [],
  test,
  render
}: {
  Component: StatefulListWithDefaults;
  propList: Props[];
  test?: Test<R>;
  render: Render<R>;
}) {
  describe(`${Component.displayName} renders without crashing`, () => {
    if (!test) {
      it("with no props", () => {
        render(<Component />);
      });
    }

    propList.forEach((props, i) => {
      it(`with props propList[${i}]`, () => {
        if (Array.isArray(test)) {
          test = test[i];
        }

        if (typeof test === "function") {
          test({ ui: <Component {...props} />, render });
        }
      });
    });
  });
}

export default function testSuite<R>({
  StatelessList,
  StatefulList,
  propList = [],
  statelessTest,
  statefulTest,
  render
}: {
  StatelessList: StatelessListWithDefaults;
  StatefulList: StatefulListWithDefaults;
  propList: Props[];
  statelessTest?: Test<R>;
  statefulTest?: Test<R>;
  render: Render<R>;
}) {
  statelessListTestSuite({
    Component: StatelessList,
    propList,
    test: statelessTest,
    render
  });
  statefulListTestSuite({
    Component: StatefulList,
    propList,
    test: statefulTest,
    render
  });
}