export const save = <T extends unknown>(localStorageId: string) => (
  data: T
) => {
  localStorage.setItem(localStorageId, JSON.stringify(data));
};

export const fetch = <T extends unknown>(localStorageId: string) => () => {
  const data = localStorage.getItem(localStorageId);

  if (data) {
    return JSON.parse(data) as T;
  }
};
