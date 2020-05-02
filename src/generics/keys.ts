export type OmittableKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type HasKeys<T, U> = Exclude<U, keyof T> extends never ? true : false;

export type DistinctKeys<T, U> = HasKeys<T, U> extends false
  ? HasKeys<U, T> extends false
    ? true
    : false
  : false;
