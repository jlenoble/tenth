export const haveTextContents = (list: HTMLUListElement, items: string[]) => {
  const texts = Array.from(list.querySelectorAll("li")).map(
    li => li.textContent
  );
  expect(texts).toEqual(items);
};

export const haveChecks = (list: HTMLUListElement, items: boolean[]) => {
  const checks = (Array.from(
    list.querySelectorAll('input[type="checkbox"]')
  ) as HTMLInputElement[]).map(input => input.checked);
  expect(checks).toEqual(items);
};
