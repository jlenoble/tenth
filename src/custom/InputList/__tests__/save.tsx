import React from "react";
import { StatefulInputList as InputList } from "..";
import defaultTmpId from "../../defaultTmpId";
import {
  render,
  saveItems,
  fetchItems,
  todoListKey,
  createItemsFromTexts
} from "../__helpers__";

const getItems = fetchItems(todoListKey);
const setItems = saveItems(todoListKey);
const createItems = createItemsFromTexts(defaultTmpId);

const makeExpectProps = ({
  expectTextContents,
  expectChecks
}: {
  expectTextContents: (items: string[]) => void;
  expectChecks: (items: boolean[]) => void;
}) => ({
  texts,
  checks,
  savedTexts,
  savedChecks
}: {
  texts: string[];
  checks: boolean[];
  savedTexts?: string[];
  savedChecks?: boolean[];
}) => {
  expectTextContents(texts);
  expectChecks(checks);

  const items = getItems();
  expect(items.map(item => item.text)).toEqual(savedTexts || texts);
  expect(items.map(item => item.checked)).toEqual(savedChecks || checks);
};

describe("Items in InputList can be persisted", () => {
  beforeEach(() => {
    const items = createItems(["foo", "bar", "baz"]);
    items[1].checked = true;
    setItems(items);
  });

  it("by setting onSetItems only: Previous data are lost", async () => {
    const {
      add,
      checkNthChild,
      removeNthChild,
      expectTextContents,
      expectChecks
    } = render(<InputList onSetItems={setItems} />);
    const expectProps = makeExpectProps({ expectTextContents, expectChecks });

    expectProps({
      texts: [],
      checks: [],
      savedTexts: ["foo", "bar", "baz"],
      savedChecks: [false, true, false]
    });

    await add(["qux", "quux"]);
    expectProps({
      texts: ["qux", "quux"],
      checks: [false, false]
    });

    checkNthChild(0);
    expectProps({
      texts: ["qux", "quux"],
      checks: [true, false]
    });

    removeNthChild(0);
    expectProps({
      texts: ["quux"],
      checks: [false]
    });
  });

  it("by setting defaultItems and onSetItems: Previous data are recovered", async () => {
    const {
      add,
      checkChildren,
      removeChildren,
      expectTextContents,
      expectChecks
    } = render(<InputList defaultItems={getItems()} onSetItems={setItems} />);
    const expectProps = makeExpectProps({ expectTextContents, expectChecks });

    expectProps({
      texts: ["foo", "bar", "baz"],
      checks: [false, true, false]
    });

    await add(["qux", "quux"]);
    expectProps({
      texts: ["foo", "bar", "baz", "qux", "quux"],
      checks: [false, true, false, false, false]
    });

    checkChildren([0, 1, 4]);
    expectProps({
      texts: ["foo", "bar", "baz", "qux", "quux"],
      checks: [true, false, false, false, true]
    });

    removeChildren([1, 4, 2]);
    expectProps({
      texts: ["foo", "qux"],
      checks: [true, false]
    });
  });

  test.todo("by setting localStorageKey");
});
