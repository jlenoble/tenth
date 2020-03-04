import React, { ComponentType } from "react";
import { render } from "@testing-library/react";

export function instantiateTestSuite<P = any>(Component: ComponentType<P>) {
  describe(`${Component.displayName} renders without crashing`, () => {
    it("without any attributes", () => {
      // @ts-ignore TS2322
      render(<Component />);
    });
  });
}

export default instantiateTestSuite;
