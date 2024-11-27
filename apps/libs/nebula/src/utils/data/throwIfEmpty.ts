import { isNil } from 'lodash';

// For find/findOne calls in typeorm, if an id/query parameter is unexpectedly null or undefined, it can lead to queries
// which match any result. Using this to test parameters at the last moment in case of unexpected situations, but more
// user friendly errors should have been returned earlier by DTO validation.

const throwIfEmpty = <T>(val: T | null | undefined): T => {
  if (isNil(val)) {
    throw new Error('Query parameter unexpectedly empty');
  }
  return val;
};

export default throwIfEmpty;
