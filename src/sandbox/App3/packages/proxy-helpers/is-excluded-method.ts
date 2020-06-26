export const isExcludedMethod = (method: string): boolean => {
  switch (method) {
    case "constructor":
    case "call":
    case "apply":
    case "bind":
      return true;

    default:
      return false;
  }
};
