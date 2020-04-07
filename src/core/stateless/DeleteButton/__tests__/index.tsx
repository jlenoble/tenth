import React, { MouseEvent } from "react";
import { render } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import DeleteButton from "..";

describe("Testing DeleteButton", () => {
  it("Rendering", () => {
    const onClick = () => {};

    render(<DeleteButton onClick={onClick} />);
  });

  it("Clicking", () => {
    let deleted = false;
    const onClick = (event: MouseEvent<HTMLButtonElement>) => {
      deleted = Boolean(event);
    };

    const { getByRole } = render(<DeleteButton onClick={onClick} />);

    const deleteButton = getByRole("button");
    expect(deleted).toEqual(false);

    userEvents.click(deleteButton);
    expect(deleted).toEqual(true);

    deleted = false;
    userEvents.click(deleteButton);
    expect(deleted).toEqual(true);
  });
});
