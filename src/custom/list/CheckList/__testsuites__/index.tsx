import React from "react";
import { render } from "./render";
import {
  StatelessListWithDefaults,
  StatefulListWithDefaults,
  Props
} from "../../ListFactory";
import { RequiredKeys } from "../../../../generics";

export function checkStatelessListTestSuite(
  Component: StatelessListWithDefaults,
  propList: RequiredKeys<Props, "defaultItems">[] = []
) {
  describe(`${Component.displayName} can check elements`, () => {
    propList.forEach(({ defaultItems, ...props }, i) => {
      it(`with props propList[${i}]`, () => {
        const itemHooks = { items: defaultItems };
        const { checkNthChild, expectChecks } = render(
          <Component itemHooks={itemHooks} {...props} />
        );

        const result = defaultItems.map(item => item.checked);
        expectChecks(result);

        checkNthChild(0);
        expectChecks(result);

        checkNthChild(2);
        expectChecks(result);

        checkNthChild(0);
        expectChecks(result);
      });
    });
  });
}

export function checkStatefulListTestSuite(
  Component: StatefulListWithDefaults,
  propList: RequiredKeys<Props, "defaultItems">[] = []
) {
  describe(`${Component.displayName} can check elements`, () => {
    propList.forEach((props, i) => {
      it(`with props propList[${i}]`, () => {
        const { checkNthChild, expectChecks } = render(
          <Component {...props} />
        );

        const result = props.defaultItems.map(item => item.checked);
        expectChecks(result);

        checkNthChild(0);
        result[0] = !result[0];
        expectChecks(result);

        checkNthChild(2);
        result[2] = !result[2];
        expectChecks(result);

        checkNthChild(0);
        result[0] = !result[0];
        expectChecks(result);
      });
    });
  });
}

const defaultItems = [
  { id: "1", text: "a", checked: true },
  { id: "2", text: "b", checked: false },
  { id: "3", text: "c", checked: true }
];

export function checkTestSuite(
  StatelessList: StatelessListWithDefaults,
  StatefulList: StatefulListWithDefaults
) {
  const propList = [{ defaultItems }];
  checkStatelessListTestSuite(StatelessList, propList);
  checkStatefulListTestSuite(StatefulList, propList);
}

export default checkTestSuite;
