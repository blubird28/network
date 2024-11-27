import { isEmpty, isString } from 'lodash';

export const isNonEmptyString = (test: unknown): test is string =>
  isString(test) && !isEmpty(test);
