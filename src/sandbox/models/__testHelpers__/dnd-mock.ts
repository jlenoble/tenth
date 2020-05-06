export const mockGetComputedStyle = () => {
  jest.spyOn(window, "getComputedStyle").mockImplementation(
    () =>
      ({
        paddingTop: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
        paddingLeft: "0px",
        marginTop: "0px",
        marginRight: "0px",
        marginBottom: "0px",
        marginLeft: "0px",
        borderTopWidth: "0px",
        borderRightWidth: "0px",
        borderBottomWidth: "0px",
        borderLeftWidth: "0px",
        display: "block",
      } as CSSStyleDeclaration)
  );
};

export const mockGetBoundingClientRect = (el: HTMLElement) => {
  jest.spyOn(el, "getBoundingClientRect").mockImplementation(() => ({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON() {
      return JSON.stringify(this);
    },
  }));
};
