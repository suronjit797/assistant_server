/* eslint-disable @typescript-eslint/no-explicit-any */

const pic = <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Partial<T> => {
  return keys.reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
};

export default pic;
