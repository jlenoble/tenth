export type ManagerConsts = {
  CREATE: "CREATE";
  DESTROY: "DESTROY";
  MODIFY: "MODIFY";
  DO_CREATE: "DO_CREATE";
  DO_DESTROY: "DO_DESTROY";
  DO_MODIFY: "DO_MODIFY";
};

const makeConstants = (managerId: string, prefix: "" | "DO_" = "") => {
  return {
    [prefix + "CREATE"]: managerId + "_" + prefix + "CREATE",
    [prefix + "DESTROY"]: managerId + "_" + prefix + "DESTROY",
    [prefix + "MODIFY"]: managerId + "_" + prefix + "MODIFY"
  };
};

export const makeManagerConstants = (managerId: string) => {
  return {
    ...makeConstants(managerId),
    ...makeConstants(managerId, "DO_")
  } as ManagerConsts; // Trick Typescript to discriminate between constructed strings
};
