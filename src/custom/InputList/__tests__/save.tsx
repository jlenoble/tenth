import React from "react";
import InputList, { Item, defaultTmpId } from "..";
import {
  render,
  saveItems,
  getItemsFromLocalStorage,
  setItemsInLocalStorage,
  todoListKey,
  createItemsFromTexts
} from "../__helpers__";

const getItems = getItemsFromLocalStorage(todoListKey);
const setItems = setItemsInLocalStorage(todoListKey);
const createItems = createItemsFromTexts(defaultTmpId);

describe("Items in InputList can be persisted", () => {
  beforeEach(() => {
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

    let items = getItems();
    expect(items.map(item => item.text)).toEqual(["qux", "quux"]);
    expect(items.map(item => item.checked)).toEqual([false, false]);

    checkNthChild(0);
    expectTextContents(["qux", "quux"]);
    expectChecks([true, false]);

    items = getItems();
    expect(items.map(item => item.text)).toEqual(["qux", "quux"]);
    expect(items.map(item => item.checked)).toEqual([true, false]);
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

    let items = getItems();

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

    checkNthChild(0);
    checkNthChild(1);
    checkNthChild(4);
    expectTextContents(["foo", "bar", "baz", "qux", "quux"]);
    expectChecks([true, false, false, false, true]);

    items = getItems();

    expect(items.map(item => item.text)).toEqual([
      "foo",
      "bar",
      "baz",
      "qux",
      "quux"
    ]);
    expect(items.map(item => item.checked)).toEqual([
      true,
      false,
      false,
      false,
      true
    ]);
  });

  test.todo("by setting itemHooks");
  test.todo("by setting defaultItems and itemHooks");

  test.todo("by setting localStorageKey");
  test.todo("by setting localStorageKey and itemHooks");
});
