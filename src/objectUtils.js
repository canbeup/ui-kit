export const flatten = arrayOfArrays =>
  arrayOfArrays.reduce((a, b) => a.concat(b), []);
export const getAnyFromArray = (array = []) =>
  array.length > 0 ? array[0] : null;
