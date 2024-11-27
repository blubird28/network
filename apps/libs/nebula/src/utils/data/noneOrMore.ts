import { isNull, isUndefined } from 'lodash';

import oneOrMore from './oneOrMore';
import { ZeroOrMore } from './zeroOrMore';

// returns undefined if input is nil, otherwise wraps input in an array (if it is not one already)
const noneOrMore = <T>(items: ZeroOrMore<T>): T[] | undefined =>
  isNull(items) || isUndefined(items) ? undefined : oneOrMore(items);

export default noneOrMore;
