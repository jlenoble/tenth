import React from "react";
import InputList from "..";
import { render } from "../__helpers__";

describe("Items can be removed from InputList", () => {
  it("without any attributes", async () => {
    const { list, fillWith, removeNthChild, expectTextContents } = render(
      <InputList />
    );
    expect(list).toBeEmpty();

    await fillWith(["foo", "bar", "quux"]);
    expectTextContents(["foo", "bar", "quux"]);

    removeNthChild(0);
    expectTextContents(["bar", "quux"]);

    removeNthChild(1);
    expectTextContents(["bar"]);

    removeNthChild(0);
    expect(list).toBeEmpty();
  });
});
