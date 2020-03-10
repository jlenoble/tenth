import React, { ReactElement } from "react";
import { RenderOptions, RenderResult } from "@testing-library/react";
import { StatefulListWithDefaults, Props } from "../ListFactory";
import { defaultLocalStorageItems } from "./init-data";

type Render<R> = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => RenderResult & R;

type TestOptions<R> = { ui: ReactElement; render: Render<R>; props: Props };

export type Test<R> =
  | (
      | ((options: TestOptions<R>) => void)
      | ((options: TestOptions<R>) => Promise<void>)
    )[]
  | ((options: TestOptions<R>) => void)
  | ((options: TestOptions<R>) => Promise<void>);

export const dummyTest = <R extends {} = {}>(options: TestOptions<R>) => {};

export default function statefulListTestSuite<R>({
  Component,
  propList = [],
  test = dummyTest,
  render,
  description,
  localStorageId
}: {
  Component: StatefulListWithDefaults;
  propList: Props[];
  test?: Test<R>;
  render: Render<R>;
  description: string;
  localStorageId: string;
}) {
  describe(`${Component.displayName}: ${description}`, () => {
    beforeEach(() => {
      localStorage.setItem(
        localStorageId,
        JSON.stringify(defaultLocalStorageItems)
      );
    });

    if (test === dummyTest) {
      it("with no props", () => {
        render(<Component localStorageId={localStorageId} />);
      });
    }

    propList.forEach((props, i) => {
      it(`with props propList[${i}]`, async () => {
        if (Array.isArray(test)) {
          test = test[i];
        }

        if (typeof test === "function") {
          await test({ ui: <Component {...props} />, render, props });
        }
      });
    });
  });
}
