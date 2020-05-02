export function isTrue<T extends true>(): true {
  return true as T;
}

export function isFalse<T extends false>(): false {
  return false as T;
}

export type And<T extends boolean, U extends boolean> = T extends true
  ? U extends true
    ? true
    : false
  : false;

export type Or<T extends boolean, U extends boolean> = T extends false
  ? U extends false
    ? false
    : true
  : true;

export type Not<T extends boolean> = T extends true ? false : true;

export type Imply<T extends boolean, U extends boolean> = T extends true
  ? U extends false
    ? false
    : true
  : true;

export type Equiv<T extends boolean, U extends boolean> = T extends true
  ? U extends true
    ? true
    : false
  : U extends true
  ? false
  : true;

export type Xor<T extends boolean, U extends boolean> = T extends true
  ? U extends true
    ? false
    : true
  : U extends true
  ? true
  : false;
