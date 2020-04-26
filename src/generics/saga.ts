import { StrictEffect } from "redux-saga/effects";

export type SagaGenerator<RT = any> = Generator<
  StrictEffect<any, any>,
  RT,
  any
>;
