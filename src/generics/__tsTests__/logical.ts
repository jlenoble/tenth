import { isTrue, isFalse, And, Or, Not, Imply, Equiv, Xor } from "..";

// And
isTrue<And<true, true>>();
isFalse<And<true, false>>();
isFalse<And<false, true>>();
isFalse<And<false, false>>();

// Or
isTrue<Or<true, true>>();
isTrue<Or<true, false>>();
isTrue<Or<false, true>>();
isFalse<Or<false, false>>();

// Not
isFalse<Not<true>>();
isTrue<Not<false>>();

// Imply
isTrue<Imply<true, true>>();
isFalse<Imply<true, false>>();
isTrue<Imply<false, true>>();
isTrue<Imply<false, false>>();

// Equiv
isTrue<Equiv<true, true>>();
isFalse<Equiv<true, false>>();
isFalse<Equiv<false, true>>();
isTrue<Equiv<false, false>>();

// Xor
isFalse<Xor<true, true>>();
isTrue<Xor<true, false>>();
isTrue<Xor<false, true>>();
isFalse<Xor<false, false>>();
