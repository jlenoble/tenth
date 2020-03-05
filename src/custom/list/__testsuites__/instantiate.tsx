import React from "react";
import { render } from "@testing-library/react";
import {
  StatelessListWithDefaults,
  StatefulListWithDefaults,
  Props
} from "../ListFactory";

export function instantiateStatelessListTestSuite(
  Component: StatelessListWithDefaults,
  propList: Props[] = []
) {
  describe(`${Component.displayName} renders without crashing`, () => {
    it("with no props", () => {
      render(<Component />);
    });

    propList.forEach(({ defaultItems, ...props }, i) => {
      it(`with props propList[${i}]`, () => {
        const itemHooks = { items: defaultItems };
        render(<Component itemHooks={itemHooks} {...props} />);
      });
    });
  });
}

export function instantiateStatefulListTestSuite(
  Component: StatefulListWithDefaults,
  propList: Props[] = []
) {
  describe(`${Component.displayName} renders without crashing`, () => {
    it("with no props", () => {
      render(<Component />);
    });

    propList.forEach((props, i) => {
      it(`with props propList[${i}]`, () => {
        render(<Component {...props} />);
      });
    });
  });
}

export default function instantiateTestSuite(
  StatelessList: StatelessListWithDefaults,
  StatefulList: StatefulListWithDefaults,
  propList: Props[] = []
) {
  instantiateStatelessListTestSuite(StatelessList, propList);
  instantiateStatefulListTestSuite(StatefulList, propList);
}
