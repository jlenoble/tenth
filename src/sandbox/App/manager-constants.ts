export type ManagerConsts = {
  CREATE: "CREATE";
  DESTROY: "DESTROY";
  MODIFY: "MODIFY";
  SET: "SET";
  CLEAR: "CLEAR";

  DO_CREATE: "DO_CREATE";
  DO_DESTROY: "DO_DESTROY";
  DO_MODIFY: "DO_MODIFY";
  DO_SET: "DO_SET";
  DO_CLEAR: "DO_CLEAR";

  READY: "READY";
};

const makeConstants = (managerId: string, prefix: "" | "DO_" = "") => {
  return {
    [prefix + "CREATE"]: managerId + "_" + prefix + "CREATE",
    [prefix + "DESTROY"]: managerId + "_" + prefix + "DESTROY",
    [prefix + "MODIFY"]: managerId + "_" + prefix + "MODIFY",
    [prefix + "SET"]: managerId + "_" + prefix + "SET",
    [prefix + "CLEAR"]: managerId + "_" + prefix + "CLEAR"
  };
};

export const makeManagerConstants = (managerId: string) => {
  return {
    ...makeConstants(managerId),
    ...makeConstants(managerId, "DO_"),
    READY: managerId + "_READY"
  } as ManagerConsts; // Trick Typescript to discriminate between constructed strings
};
