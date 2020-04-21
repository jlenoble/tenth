import React, { FunctionComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider, useDispatch } from "react-redux";
import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { TodoList, combinedReducer, defaultTitle } from "../TodoList";
import {
  resetTodos,
  tmpId,
  watchInputs,
  watchVisibilityFilter,
  rootId
} from "../todo";

const List: FunctionComponent<{ items: string[] }> = ({ items }) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(combinedReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(watchVisibilityFilter);
  sagaMiddleware.run(watchInputs);

  const InnerList: FunctionComponent = () => {
    const dispatch = useDispatch();
    dispatch(
      resetTodos({
        partId: rootId,
        todos: items.map((item) => ({
          id: tmpId(),
          title: item,
          completed: false
        }))
      })
    );
    return <TodoList viewId={rootId} />;
  };

  return (
    <Provider store={store}>
      <InnerList />
    </Provider>
  );
};

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
    fireEvent.keyDown(textbox, {
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

  it("Edit title", async () => {
    const { container } = render(<List items={["foo", "bar", "baz"]} />);

    const cardHeaderContent = container.querySelector(
      CONTENT_ATTRIBUTE
    ) as HTMLElement;
    const { getByRole, getByText } = within(cardHeaderContent);

    const text = getByText(defaultTitle) as HTMLSpanElement;

    userEvents.click(text);
    expect(text).not.toBeInTheDocument();

    const textbox = getByRole("textbox") as HTMLInputElement;

    await userEvents.type(textbox, "bozo");
    fireEvent.keyDown(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });
    expect(textbox).not.toBeInTheDocument();

    const title = cardHeaderContent.querySelector(
      TITLE_ATTRIBUTE
    ) as HTMLElement;
    expect(title.textContent).toEqual(defaultTitle + "bozo");
  });
});
