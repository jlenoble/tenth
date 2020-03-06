export const expectTextContents = (list: HTMLUListElement, items: string[]) => {
  const texts = Array.from(list.querySelectorAll("li")).map(
    li => li.textContent
  );
  expect(texts).toEqual(items);
};

export { expectChecks } from "../../list/__testsuites__/check/expect";
