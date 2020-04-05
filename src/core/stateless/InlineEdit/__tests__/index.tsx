import React from "react";
import { render, fireEvent } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { InlineEdit } from "..";
import { StatefulInlineEdit } from "../../../stateful";

describe("Testing InlineEdit", () => {
  it("Rendering", () => {
    const update = (value: string) => {};

    render(
      <StatefulInlineEdit
        initialValue={""}
        callback={update}
        InlineEdit={InlineEdit}
      />
    );
  });

  it("Editing: Enter keypress", async () => {
    let text = "";
    const update = (value: string) => {
      text = value;
    };

    const { getByText, getByRole } = render(
      <StatefulInlineEdit
        initialValue={"foo"}
        callback={update}
        InlineEdit={InlineEdit}
      />
    );

    let typography = getByText("foo");
    expect(typography).toBeInTheDocument();

    userEvents.click(typography);
    expect(typography).not.toBeInTheDocument();

    let input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual("foo");

    fireEvent.keyPress(input, { keyCode: 13 });
    expect(input).not.toBeInTheDocument();

    typography = getByText("foo");
    expect(typography).toBeInTheDocument();

    userEvents.click(typography);
    expect(typography).not.toBeInTheDocument();

    input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual("foo");

    await userEvents.type(input, "bar");
    expect(input.value).toEqual("foobar");

    fireEvent.keyPress(input, { keyCode: 13 });
    expect(input).not.toBeInTheDocument();

    typography = getByText("foobar");
    expect(typography).toBeInTheDocument();

    userEvents.click(typography);
    expect(typography).not.toBeInTheDocument();

    input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual("foobar");

    await userEvents.type(input, "baz");
    expect(input.value).toEqual("foobarbaz");

    fireEvent.keyPress(input, { keyCode: 13 });
    expect(input).not.toBeInTheDocument();

    typography = getByText("foobarbaz");
    expect(typography).toBeInTheDocument();
  });

  it("Editing: Blurring", async () => {
    let text = "";
    const update = (value: string) => {
      text = value;
    };

    const { getByText, getByRole } = render(
      <StatefulInlineEdit
        initialValue={"foo"}
        callback={update}
        InlineEdit={InlineEdit}
      />
    );

    let typography = getByText("foo");
    expect(typography).toBeInTheDocument();

    userEvents.click(typography);
    expect(typography).not.toBeInTheDocument();

    let input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual("foo");

    input.blur();
    expect(input).not.toBeInTheDocument();

    typography = getByText("foo");
    expect(typography).toBeInTheDocument();

    userEvents.click(typography);
    expect(typography).not.toBeInTheDocument();

    input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual("foo");

    await userEvents.type(input, "bar");
    expect(input.value).toEqual("foobar");

    input.blur();
    expect(input).not.toBeInTheDocument();

    typography = getByText("foobar");
    expect(typography).toBeInTheDocument();

    userEvents.click(typography);
    expect(typography).not.toBeInTheDocument();

    input = getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toEqual("foobar");

    await userEvents.type(input, "baz");
    expect(input.value).toEqual("foobarbaz");

    input.blur();
    expect(input).not.toBeInTheDocument();

    typography = getByText("foobarbaz");
    expect(typography).toBeInTheDocument();
  });
});
