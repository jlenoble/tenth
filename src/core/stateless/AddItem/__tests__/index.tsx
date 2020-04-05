import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { AddItem } from "..";
import { StatefulAddItem } from "../../../stateful";

describe("Testing AddItem", () => {
  it("Rendering", () => {
    const add = (value: string) => {};

    render(<StatefulAddItem callback={add} AddItem={AddItem} />);
  });

  it("Adding: Enter keypress", async () => {
    let text: string = "";
    const add = (value: string) => {
      text = value;
    };

    const { getByRole } = render(
      <StatefulAddItem callback={add} AddItem={AddItem} />
    );

    const textbox = getByRole("textbox") as HTMLInputElement;
    expect(textbox).toBeInTheDocument();
    expect(text).toEqual("");

    await userEvents.type(textbox, "foo");
    expect(text).toEqual("");
    expect(textbox.value).toEqual("foo");

    fireEvent.keyPress(textbox, { keyCode: 13 });
    expect(text).toEqual("foo");
    expect(textbox.value).toEqual("");
  });

  it("Adding: Button click", async () => {
    let text: string = "";
    const add = (value: string) => {
      text = value;
    };

    const { getByText, getByRole } = render(
      <StatefulAddItem callback={add} AddItem={AddItem} />
    );

    const textbox = getByRole("textbox") as HTMLInputElement;
    const addButton = getByText(/add/i) as HTMLButtonElement;
    expect(textbox).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    expect(text).toEqual("");

    await userEvents.type(textbox, "bar");
    expect(text).toEqual("");
    expect(textbox.value).toEqual("bar");

    userEvents.click(addButton);
    expect(text).toEqual("bar");
    expect(textbox.value).toEqual("");
  });
});
