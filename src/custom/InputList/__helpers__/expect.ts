export const expectTextContents = (list: HTMLUListElement, items: string[]) => {
  const texts = Array.from(list.querySelectorAll("li")).map(
    li => li.textContent
  );
  expect(texts).toEqual(items);
};

export const expectChecks = (list: HTMLUListElement, items: boolean[]) => {
  const checks = (Array.from(
    list.querySelectorAll('input[type="checkbox"]')
  ) as HTMLInputElement[]).map(input => input.checked);
  expect(checks).toEqual(items);
};
