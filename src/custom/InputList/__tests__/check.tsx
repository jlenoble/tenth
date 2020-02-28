import React from "react";
import InputList from "..";
import { render } from "../__helpers__";

describe("Items can be checked in InputList", () => {
  it("without any attributes", async () => {
    const { list, fillWith, checkNthChild, expectChecks } = render(
      <InputList />
    );
    expect(list).toBeEmpty();

    await fillWith(["foo", "bar", "quux"]);
    expectChecks([false, false, false]);

    checkNthChild(0);
    expectChecks([true, false, false]);

    checkNthChild(2);
    expectChecks([true, false, true]);

    checkNthChild(0);
    expectChecks([false, false, true]);
  });
});
