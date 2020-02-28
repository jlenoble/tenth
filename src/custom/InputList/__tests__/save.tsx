import React from "react";
import InputList, { Item, defaultTmpId } from "..";
import {
  render,
  saveItems,
  todoListKey,
  createItemsFromTexts
} from "../__helpers__";

const getItems = () => JSON.parse(localStorage.getItem(todoListKey)!) as Item[];
const setItems = (items: Item[]) =>
  localStorage.setItem(todoListKey, JSON.stringify(items));

describe("Items in InputList can be persisted", () => {
  beforeEach(() => {
    const createItems = createItemsFromTexts(defaultTmpId);
    const items = createItems(["foo", "bar", "baz"]);

    items[1].checked = true;

    setItems(items);
  });

  it("by setting onSetItems: Previous data are lost", async () => {
    const {
      fillWith,
      checkNthChild,
      expectTextContents,
      expectChecks
    } = render(<InputList onSetItems={saveItems(todoListKey)} />);
    expectTextContents([]);
    expectChecks([]);

    await fillWith(["qux", "quux"]);
    expectTextContents(["qux", "quux"]);
    expectChecks([false, false]);

    const items = getItems();

    expect(items.map(item => item.text)).toEqual(["qux", "quux"]);
    expect(items.map(item => item.checked)).toEqual([false, false]);
  });

  it("by setting defaultItems and onSetItems: Previous data are recovered", async () => {
    const {
      fillWith,
      checkNthChild,
      expectTextContents,
      expectChecks
    } = render(
      <InputList
        defaultItems={JSON.parse(localStorage.getItem(todoListKey) || "[]")}
        onSetItems={saveItems(todoListKey)}
      />
    );
    expectTextContents(["foo", "bar", "baz"]);
    expectChecks([false, true, false]);

    await fillWith(["qux", "quux"]);
    expectTextContents(["foo", "bar", "baz", "qux", "quux"]);
    expectChecks([false, true, false, false, false]);

    const items = getItems();

    expect(items.map(item => item.text)).toEqual([
      "foo",
      "bar",
      "baz",
      "qux",
      "quux"
    ]);
    expect(items.map(item => item.checked)).toEqual([
      false,
      true,
      false,
      false,
      false
    ]);
  });

  test.todo("by setting itemHooks");
  test.todo("by setting defaultItems and itemHooks");
});
