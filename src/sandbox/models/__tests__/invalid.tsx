import React, { FunctionComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider, useDispatch } from "react-redux";
import { render, fireEvent, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { TodoList, combinedReducer } from "../TodoList";
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
    return <TodoList viewId={rootId} title={"TODOS"} />;
  };

  return (
    <Provider store={store}>
      <InnerList />
    </Provider>
  );
};

describe("TodoList", () => {
  it("Show error", () => {
    const { getByRole } = render(<List items={["foo", "", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];
    let listitem = listitems[1];
    const { getByRole: subGetByRole } = within(listitem);

    const alert = subGetByRole("alert") as HTMLDivElement;
    expect(alert.textContent).toEqual("");
  });

  it("Correct error", async () => {
    const { getByRole } = render(<List items={["foo", "", "baz"]} />);

    const list = getByRole("list") as HTMLUListElement;
    const { getAllByRole } = within(list);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];
    let listitem = listitems[1];
    const { getByRole: subGetByRole } = within(listitem);

    const alert = subGetByRole("alert") as HTMLDivElement;

    userEvents.click(alert);
    expect(alert).not.toBeInTheDocument();

    const textbox = subGetByRole("textbox") as HTMLInputElement;
    await userEvents.type(textbox, "bar");

    fireEvent.keyDown(textbox, {
      key: "Enter",
      code: 13,
      charCode: 13,
      keyCode: 13
    });

    expect(textbox).not.toBeInTheDocument();
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });
});
