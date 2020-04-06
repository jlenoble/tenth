import React from "react";
import { render } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { StatefulCheckbox as Checkbox } from "..";

describe("Testing Checkbox", () => {
  it("Rendering", () => {
    const select = () => {};

    render(<Checkbox initialValue={false} callback={select} />);
  });

  it("Checking", () => {
    let selected = false;
    const select = (value: boolean) => {
      selected = value;
    };

    const { getByRole } = render(
      <Checkbox initialValue={selected} callback={select} />
    );

    const checkbox = getByRole("checkbox");
    expect(selected).toEqual(false);

    userEvents.click(checkbox);
    expect(selected).toEqual(true);

    userEvents.click(checkbox);
    expect(selected).toEqual(false);
  });
});
