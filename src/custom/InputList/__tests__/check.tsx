import React from "react";
import InputList from "..";
import { render } from "../__helpers__";

describe("Items can be checked in InputList", () => {
  it("without any attributes", async () => {
    const { list, fillWith, checkNthChild, haveChecks } = render(<InputList />);
    expect(list).toBeEmpty();

    await fillWith(["foo", "bar", "quux"]);
    haveChecks([false, false, false]);

    checkNthChild(0);
    haveChecks([true, false, false]);

    checkNthChild(2);
    haveChecks([true, false, true]);

    checkNthChild(0);
    haveChecks([false, false, true]);
  });
});
