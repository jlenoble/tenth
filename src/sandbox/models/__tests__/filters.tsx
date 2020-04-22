import React, { FunctionComponent } from "react";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider, useDispatch } from "react-redux";
import { render, within } from "@testing-library/react";
import userEvents from "@testing-library/user-event";
import { TodoList } from "../TodoList";
import { tmpId, rootId } from "../todo";
import { resetTodos } from "../action-creators";
import { combinedReducer } from "../reducers";
import { mainSaga } from "../sagas";

const List: FunctionComponent<{ items: string[] }> = ({ items }) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(combinedReducer, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(mainSaga);

  const InnerList: FunctionComponent = () => {
    const dispatch = useDispatch();
    dispatch(
      resetTodos({
        partId: rootId,
        todos: items.map((item, i) => ({
          id: tmpId(),
          title: i ? item : "",
          completed: !(i % 2)
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

describe("Visibility filters", () => {
  it("SHOW_ACTIVE", async () => {
    const { getByRole, getAllByRole } = render(
      <List items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getAllByRole("button")[0] as HTMLButtonElement;
    userEvents.click(menu);

    const menuItem = within(document.body).getByText("Show active");
    userEvents.click(menuItem);

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "bar",
      "qux",
      "foobar"
    ]);
  });

  it("SHOW_COMPLETED", async () => {
    const { getByRole, getAllByRole } = render(
      <List items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getAllByRole("button")[0] as HTMLButtonElement;
    userEvents.click(menu);

    const menuItem = within(document.body).getByText("Show completed");
    userEvents.click(menuItem);

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual(["", "baz", "quux"]);
  });

  it("SHOW_INVALID", async () => {
    const { getByRole, getAllByRole } = render(
      <List items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getAllByRole("button")[0] as HTMLButtonElement;
    userEvents.click(menu);

    const menuItem = within(document.body).getByText("Show invalid");
    userEvents.click(menuItem);

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([""]);
  });

  it("SHOW_ALL", async () => {
    const { getByRole, getAllByRole } = render(
      <List items={["foo", "bar", "baz", "qux", "quux", "foobar"]} />
    );

    const menu = getAllByRole("button")[0] as HTMLButtonElement;
    userEvents.click(menu);
    userEvents.click(within(document.body).getByText("Show active"));
    userEvents.click(menu);
    userEvents.click(within(document.body).getByText("Show all"));

    const list = getByRole("list") as HTMLUListElement;
    const listitems = within(list).getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "",
      "bar",
      "baz",
      "qux",
      "quux",
      "foobar"
    ]);
  });
});
