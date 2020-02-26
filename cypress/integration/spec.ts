import { baseUrl } from "../../cypress.json";

context("Testing InputList", () => {
  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it("adds 3 items (with Enter keyPress)", function() {
    cy.get(".MuiInput-input")
      .type("foo{enter}")
      .type("bar{enter}")
      .type("quux{enter}");
    cy.get("ul.MuiList-root li").should("have.length", 3);
  });
});
