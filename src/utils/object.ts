export type RemoveUndefined<T extends Record<string, any>> = {
  [Property in keyof T as T[Property] extends undefined
    ? never
    : Property]: T[Property];
};

export const removeUndefined = <T extends Record<string, any>>(
  object: T,
): RemoveUndefined<T> => {
  return Object.keys(object).reduce((acc, key) => {
    if (object[key] === undefined) {
      return acc;
    }

    return {
      ...acc,
      [key]: object[key],
    };
  }, {} as RemoveUndefined<T>);
};

export const removeUndefinedAndAssign = <
  T extends Record<string, any>,
  S extends Record<string, any>,
>(
  target: T,
  source: S,
) => {
  Object.assign(target, removeUndefined(source));
};
