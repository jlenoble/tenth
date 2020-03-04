export type Omittable<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export * from "./hoc";
