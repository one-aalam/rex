
// @ts-ignore
import { sum, sub } from '@rex/core';

export const addIt = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log(`router - add: ${a}, ${b}`)
  }
  return sum(a, b);
};

export const subIt = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log(`router - sub: ${a}, ${b}`)
  }
  return sub(a, b);
};
