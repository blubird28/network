import { isArray } from 'lodash';

export type OneOrMore<T> = T | T[];

// Wraps input in an array (if it is not one already)
const oneOrMore = <T>(items: OneOrMore<T>): T[] =>
  isArray(items) ? items : [items];

export default oneOrMore;
