export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log(`core - add: ${a}, ${b}`)
  }
  return a + b;
};
export const sub = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log(`core - sub: ${a}, ${b}`)
  }
  return a - b;
};
