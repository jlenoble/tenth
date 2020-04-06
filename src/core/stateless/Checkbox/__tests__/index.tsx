import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { Checkbox } from "..";
import { StatefulSelect } from "../../../stateful";

describe("Testing Checkbox", () => {
  it("Rendering", () => {
    const select = (value: boolean) => {};

    render(
      <StatefulSelect
        initialValue={false}
        callback={select}
        Select={Checkbox}
      />
    );
  });

  it("Checking", () => {
    let selected = false;
    const select = (value: boolean) => {
      selected = value;
    };

    const { getByRole } = render(
      <StatefulSelect
        initialValue={selected}
        callback={select}
        Select={Checkbox}
      />
    );

    const checkbox = getByRole("checkbox");
    expect(selected).toEqual(false);

    userEvents.click(checkbox);
    expect(selected).toEqual(true);

    userEvents.click(checkbox);
    expect(selected).toEqual(false);
  });
});
