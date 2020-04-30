import { ManagerConsts } from "./types";

const makeConstants = (managerId: string, prefix: "" | "DO_" = "") => {
  return {
    [prefix + "CREATE"]: managerId + "_" + prefix + "CREATE",
    [prefix + "DESTROY"]: managerId + "_" + prefix + "DESTROY",
    [prefix + "MODIFY"]: managerId + "_" + prefix + "MODIFY",
    [prefix + "SET"]: managerId + "_" + prefix + "SET",
    [prefix + "CLEAR"]: managerId + "_" + prefix + "CLEAR",
    [prefix + "MOVE"]: managerId + "_" + prefix + "MOVE",
    [prefix + "SET_VISIBILITY_FILTER"]:
      managerId + "_" + prefix + "SET_VISIBILITY_FILTER"
  };
};

export const makeManagerConstants = (managerId: string) => {
  return {
    ...makeConstants(managerId),
    ...makeConstants(managerId, "DO_"),
    READY: managerId + "_READY"
  } as ManagerConsts; // Trick Typescript to discriminate between constructed strings
};
