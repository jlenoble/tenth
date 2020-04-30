import { ManagerConsts } from "../manager-consts";

export type ReadyAction<T> = {
  type: ManagerConsts["READY"];
};

export type ManagerMiscAction<T> = ReadyAction<T>;
