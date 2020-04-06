import React from "react";
import { render } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import Checkbox from "..";
import OnOff from "../../../stateful/OnOff";

describe("Testing Checkbox", () => {
  it("Rendering", () => {
    const select = () => {};

    render(
      <OnOff initialValue={false} callback={select} Component={Checkbox} />
    );
  });

  it("Checking", () => {
    let selected = false;
    const select = (value: boolean) => {
      selected = value;
    };

    const { getByRole } = render(
      <OnOff initialValue={selected} callback={select} Component={Checkbox} />
    );

    const checkbox = getByRole("checkbox");
    expect(selected).toEqual(false);

    userEvents.click(checkbox);
    expect(selected).toEqual(true);

    userEvents.click(checkbox);
    expect(selected).toEqual(false);
  });
});
