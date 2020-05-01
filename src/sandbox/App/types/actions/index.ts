import { ManagerRequestAction } from "./request-actions";
import { ManagerMiscAction } from "./misc-actions";
import { ManagerAnswerAction } from "./answer-actions";

export * from "./answer-actions";
export * from "./misc-actions";
export * from "./request-actions";

export type ManagerAction<T> =
  | ManagerRequestAction<T>
  | ManagerAnswerAction<T>
  | ManagerMiscAction;
