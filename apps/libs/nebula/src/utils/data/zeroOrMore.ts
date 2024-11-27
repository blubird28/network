import { isNull, isUndefined } from 'lodash';

import oneOrMore, { OneOrMore } from './oneOrMore';

export type ZeroOrMore<T> = undefined | null | OneOrMore<T>;

// returns an empty array if input is nil, otherwise wraps input in an array (if it is not one already)
const zeroOrMore = <T>(items: ZeroOrMore<T>): T[] =>
  isNull(items) || isUndefined(items) ? [] : oneOrMore(items);

export default zeroOrMore;
