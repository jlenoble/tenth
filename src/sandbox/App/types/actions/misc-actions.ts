import { ManagerConsts } from "../manager-consts";

export type ReadyAction = {
  type: ManagerConsts["READY"];
};

export type ManagerMiscAction = ReadyAction;
