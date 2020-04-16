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

const defaultTitle = "Test ListCard";
const CONTENT_ATTRIBUTE = ".MuiCardHeader-content";
const TITLE_ATTRIBUTE = ".MuiCardHeader-title";

describe("TodoList", () => {
  it("Edit Item primary", async () => {
    const { getByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];
    let listitem = listitems[1];
    const { getByRole: subGetByRole, getByText } = within(listitem);

    let text = getByText("bar") as HTMLSpanElement;

    userEvents.click(text);
    expect(text).not.toBeInTheDocument();

    let textbox = subGetByRole("textbox") as HTMLInputElement;

    await userEvents.type(textbox, "bozo");
    fireEvent.keyPress(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });
    expect(textbox).not.toBeInTheDocument();

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "barbozo",
      "baz"
    ]);
  });

  // it("Edit title", async () => {
  //   const { container } = render(<List items={["foo", "bar", "baz"]} />);

  //   const cardHeaderContent = container.querySelector(
  //     CONTENT_ATTRIBUTE
  //   ) as HTMLElement;
  //   const { getByRole, getByText } = within(cardHeaderContent);

  //   const text = getByText(defaultTitle) as HTMLSpanElement;

  //   userEvents.click(text);
  //   expect(text).not.toBeInTheDocument();

  //   const textbox = getByRole("textbox") as HTMLInputElement;

  //   await userEvents.type(textbox, "bozo");
  //   fireEvent.keyPress(textbox, {
  //     key: "Enter",
  //     code: 13,
  //     charCode: 13,
  //     keyCode: 13
  //   });
  //   expect(textbox).not.toBeInTheDocument();

  //   const title = cardHeaderContent.querySelector(
  //     TITLE_ATTRIBUTE
  //   ) as HTMLElement;
  //   expect(title.textContent).toEqual(defaultTitle + "bozo");
  // });
});
