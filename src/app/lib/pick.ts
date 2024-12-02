const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<Pick<T, K>> => {
  const res: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (key in obj) {
      res[key] = obj[key];
    }
  }

  return res;
};

export default pick;
