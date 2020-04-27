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
  } as {
    CREATE: string;
    DESTROY: string;
    MODIFY: string;
    DO_CREATE: string;
    DO_DESTROY: string;
    DO_MODIFY: string;
  };
};
