import { baseUrl } from "../../cypress.json";

context("InputList", () => {
  const root = "#root";
  const textbox = `${root} input.MuiInput-input`;
  const addButton = `${root} button.MuiButton-root`;
  const list = `${root} ul.MuiList-root`;
  const listItem = `${list} li.MuiListItem-root`;
  const checkbox = `${listItem} span.MuiCheckbox-root input[type="checkbox"]`;
  const text = `${listItem} span.MuiListItemTextPrimary`;
  const deleteButton = `${listItem} button[aria-label="Delete item"].MuiIconButton-root`;

  const defaultItems = ["foo", "bar", "baz"];
  const defaultChecks = [false, false, false];

  const addItems = (items = defaultItems) => {
    items.forEach(item => {
      cy.get(textbox).type(`${item}{enter}`);
    });
  };

  const BUTTON_INDEX = 0;
  const SLOPPY_CLICK_THRESHOLD = 10;

  const dragAndDrop = (subject: string, target: string) => {
    cy.get(target).then($target => {
      let coordsDrop = $target[0].getBoundingClientRect();
      cy.get(subject).then(subject => {
        const coordsDrag = subject[0].getBoundingClientRect();
        cy.wrap(subject)
          .trigger("mousedown", {
            button: BUTTON_INDEX,
            clientX: coordsDrag.x,
            clientY: coordsDrag.y,
            force: true
          })
          .trigger("mousemove", {
            button: BUTTON_INDEX,
            clientX: coordsDrag.x + SLOPPY_CLICK_THRESHOLD,
            clientY: coordsDrag.y,
            force: true
          });

        cy.get("body")
          .trigger("mousemove", {
            button: BUTTON_INDEX,
            clientX: coordsDrop.x,
            clientY: coordsDrop.y,
            force: true
          })
          .trigger("mouseup")
          .wait(500);
      });
    });
  };

  const testTextContents = (items = defaultItems) => {
    items.forEach((item, i) => {
      cy.get(listItem)
        .eq(i)
        .should("have.text", item);
    });
  };

  const testChecks = (checks = defaultChecks) => {
    checks.forEach((check, i) => {
      cy.get(checkbox)
        .eq(i)
        .should(`${check ? "" : "not."}be.checked`);
    });
  };

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  describe("can add items", () => {
    it("press Enter key", () => {
      addItems();
      cy.get(listItem).should("have.length", 3);
      testTextContents();
    });

    it("click ADD button", () => {
      const items = defaultItems.concat(["qux", "quux"]).reverse();

      items.forEach(item => {
        cy.get(textbox).type(item);
        cy.get(addButton).click();
      });

      cy.get(listItem).should("have.length", 5);
      testTextContents(items);
    });
  });

  describe("can remove items", () => {
    beforeEach(() => {
      addItems();
    });

    it("one by one", () => {
      cy.get(deleteButton)
        .eq(0)
        .click();
      cy.get(listItem).should("have.length", 2);
      testTextContents(defaultItems.slice(1));

      cy.get(deleteButton)
        .eq(1)
        .click();
      cy.get(listItem).should("have.length", 1);
      testTextContents(defaultItems.slice(1, 2));

      cy.get(deleteButton)
        .eq(0)
        .click();
      cy.get(listItem).should("have.length", 0);
    });

    it("clear all");
  });

  describe("can check items", () => {
    beforeEach(() => {
      addItems();
    });

    it("one by one", () => {
      testChecks();

      cy.get(checkbox)
        .eq(0)
        .click();
      testChecks([true, false, false]);

      cy.get(checkbox)
        .eq(2)
        .click();
      testChecks([true, false, true]);

      cy.get(checkbox)
        .eq(0)
        .click();
      testChecks([false, false, true]);
    });

    it("check all");
    it("uncheck all");
    it("toggle all");
  });

  describe("can drag and drop items", () => {
    beforeEach(() => {
      addItems();
    });

    it("one by one", () => {
      dragAndDrop(
        "li.MuiListItem-root:nth-child(1)",
        "li.MuiListItem-root:nth-child(2)"
      );
      testTextContents(["bar", "foo", "baz"]);

      dragAndDrop(
        "li.MuiListItem-root:nth-child(2)",
        "li.MuiListItem-root:nth-child(3)"
      );
      testTextContents(["bar", "baz", "foo"]);

      dragAndDrop(
        "li.MuiListItem-root:nth-child(1)",
        "li.MuiListItem-root:nth-child(3)"
      );
      testTextContents(["baz", "foo", "bar"]);

      dragAndDrop(
        "li.MuiListItem-root:nth-child(2)",
        "li.MuiListItem-root:nth-child(1)"
      );
      testTextContents(["foo", "baz", "bar"]);
    });
  });
});
