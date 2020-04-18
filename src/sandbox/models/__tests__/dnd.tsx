import React, { FunctionComponent } from "react";
import { createStore } from "redux";
import { Provider, useDispatch } from "react-redux";
import { TodoList, combinedReducer } from "../TodoList";
import { resetTodos, tmpId } from "../todo";
import { getDroppables, getDraggables } from "../../list/__testHelpers__/dnd";
import { mockGetBoundingClientRect } from "../../list/__testHelpers__/dnd-mock";
import { render } from "../../list/__testHelpers__/dnd-render";

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

describe("DnD List", () => {
  it("Initialize", () => {
    const { getAllByRole } = render(<List items={["foo", "bar", "baz"]} />);

    const listitems = getAllByRole("listitem") as HTMLLIElement[];

    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz"
    ]);
  });

  it("Drag and drop", async () => {
    const { getAllByRole, container, dnd } = render(
      <List items={["foo", "bar", "baz", "quux"]} />
    );

    const droppables = getDroppables(container);

    droppables.forEach((droppable) => {
      mockGetBoundingClientRect(droppable);
      const draggables = getDraggables(droppable);
      draggables.forEach((draggable) => mockGetBoundingClientRect(draggable));
    });

    let listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "bar",
      "baz",
      "quux"
    ]);

    await dnd(0, 2);
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "bar",
      "baz",
      "foo",
      "quux"
    ]);

    await dnd(0, 2);
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "baz",
      "foo",
      "bar",
      "quux"
    ]);

    await dnd(1, 0);
    listitems = getAllByRole("listitem") as HTMLLIElement[];
    expect(listitems.map((li) => li.textContent)).toEqual([
      "foo",
      "baz",
      "bar",
      "quux"
    ]);
  });
});
