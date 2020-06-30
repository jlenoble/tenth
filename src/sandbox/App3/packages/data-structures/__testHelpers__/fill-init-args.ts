const length = 6;

export const fillInitArgs = <T extends unknown>(initArgs: T[]): T[] => {
  if (initArgs.length >= length) {
    return initArgs;
  }

  const args = Array.from(initArgs);

  for (let n = initArgs.length; n < length; n++) {
    args.push(initArgs[0]);
  }

  return args;
};
