import React from "react";
import userEvents from "@testing-library/user-event";
import InputList from "..";
import { render } from "../__helpers__";

describe("Items can be checked in InputList", () => {
  it("without any attributes", async () => {
    const { list, fillWith, haveChecks, getAllByRole } = render(<InputList />);
    expect(list).toBeEmpty();

    await fillWith(["foo", "bar", "quux"]);
    haveChecks([false, false, false]);

    userEvents.click(getAllByRole("checkbox")[0]);
    haveChecks([true, false, false]);

    userEvents.click(getAllByRole("checkbox")[2]);
    haveChecks([true, false, true]);

    userEvents.click(getAllByRole("checkbox")[0]);
    haveChecks([false, false, true]);
  });
});
