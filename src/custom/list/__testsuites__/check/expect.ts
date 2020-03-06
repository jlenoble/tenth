export const expectChecks = (list: HTMLUListElement, items: boolean[]) => {
  const checks = (Array.from(
    list.querySelectorAll('input[type="checkbox"]')
  ) as HTMLInputElement[]).map(input => input.checked);
  expect(checks).toEqual(items);
};
