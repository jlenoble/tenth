import React from "react";
import { fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import InputList from "..";
import { render } from "../__helpers__";

describe("Items can be added to InputList", () => {
  it("without any attributes", async () => {
    const { list, textbox, addButton } = render(<InputList />);

    expect(textbox).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(list).toBeEmpty();

    await userEvents.type(textbox, "foo");
    expect(list).toBeEmpty();

    userEvents.click(addButton);
    expect(list).toHaveTextContent("foo");

    await userEvents.type(textbox, "bar");
    expect(list).toHaveTextContent("foo");

    fireEvent.keyPress(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });
    expect(list).toHaveTextContent("foobar");
  });
});
