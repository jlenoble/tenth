import React, { FunctionComponent } from "react";
import { createStore } from "redux";
import { Provider, useDispatch } from "react-redux";
import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { TodoList, combinedReducer } from "../TodoList";
import { resetTodos, tmpId } from "../todo";

const List: FunctionComponent<{ items: string[] }> = ({ items }) => {
  const store = createStore(combinedReducer);
  const InnerList: FunctionComponent = () => {
    const dispatch = useDispatch();
    dispatch(
      resetTodos(
        items.map((item) => ({ id: tmpId(), title: item, completed: false }))
      )
    );
    return <TodoList />;
  };

  return (
    <Provider store={store}>
      <InnerList />
    </Provider>
  );
};

describe("TodoList", () => {
  it("Initialize", () => {
    const { getAllByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });

  it("Add", async () => {
    const { getByRole, getByText, getAllByRole } = render(
      <List items={["foo"]} />
    );

    const textbox = getByRole("textbox") as HTMLInputElement;
    const addButton = getByText(/add/i) as HTMLButtonElement;

    await userEvents.type(textbox, "bar");

    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo"]);

    userEvents.click(addButton);

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo", "bar"]);

    await userEvents.type(textbox, "baz");

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo", "bar"]);

    fireEvent.keyPress(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });

  it("Remove", () => {
    const { getByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    let buttons = getAllByRole("button") as HTMLButtonElement[];
    userEvents.click(buttons[0]);

    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["bar", "baz"]);

    buttons = getAllByRole("button") as HTMLButtonElement[];
    userEvents.click(buttons[1]);

    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["bar"]);

    buttons = getAllByRole("button") as HTMLButtonElement[];
    userEvents.click(buttons[0]);

    try {
      getAllByRole("listitem");
    } catch (e) {
      expect(e.message).toContain(
        `Unable to find an accessible element with the role "listitem"`
      );
    }
  });

  it("Check", () => {
    const { getByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.map((input) => input.checked)).toEqual([
      false,
      false,
      false
    ]);

    userEvents.click(checkboxes[0]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      false,
      false
    ]);

    userEvents.click(checkboxes[1]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      true,
      false
    ]);

    userEvents.click(checkboxes[0]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      false,
      true,
      false
    ]);
  });

  it("Check/Add/Remove", async () => {
    const { getByRole, getByText } = render(
      <List items={["foo", "bar", "baz"]} />
    );

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const textbox = getByRole("textbox") as HTMLInputElement;
    const addButton = getByText(/add/i) as HTMLButtonElement;

    let checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    let buttons = getAllByRole("button") as HTMLButtonElement[];

    userEvents.click(checkboxes[0]);
    userEvents.click(checkboxes[2]);
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      true,
      false,
      true
    ]);

    userEvents.click(buttons[1]);
    checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual(["foo", "baz"]);
    expect(checkboxes.map((input) => input.checked)).toEqual([true, true]);

    await userEvents.type(textbox, "quux");
    userEvents.click(addButton);
    checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    listitems = getAllByRole("listitem") as HTMLLIElement[];

    // autosort is on by default: unchecked first
    expect(listitems.map((li) => li.textContent)).toEqual([
      "quux",
      "foo",
      "baz"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      false,
      true,
      true
    ]);

    await userEvents.type(textbox, "foobar");
    userEvents.click(addButton);
    checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    listitems = getAllByRole("listitem") as HTMLLIElement[];

    // autosort is on by default: unchecked first
    expect(listitems.map((li) => li.textContent)).toEqual([
      "quux",
      "foobar",
      "foo",
      "baz"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      false,
      false,
      true,
      true
    ]);

    userEvents.click(checkboxes[2]);
    checkboxes = getAllByRole("checkbox") as HTMLInputElement[];
    listitems = getAllByRole("listitem") as HTMLLIElement[];

    // autosort is on by default: unchecked first
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "quux",
      "foobar",
      "baz"
    ]);
    expect(checkboxes.map((input) => input.checked)).toEqual([
      false,
      false,
      false,
      true
    ]);
  });
});
