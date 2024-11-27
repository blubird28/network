import { has, isEqual, isMatchWith, isPlainObject, keys } from 'lodash';

interface NotQuery {
  $not: unknown;
}

function isQueryObj(test: unknown, key: string) {
  return isPlainObject(test) && keys(test).length === 1 && has(test, key);
}
function isNotQuery(test: unknown): test is NotQuery {
  return isQueryObj(test, '$not');
}
function matchOrEqual(source: unknown, match: unknown) {
  if (isPlainObject(match) && isPlainObject(source)) {
    return isMatchWith(source as object, match as object, compareQuery);
  }
  return isEqual(source, match);
}

function compareQuery(source: unknown, match: unknown) {
  if (isNotQuery(match)) {
    return !matchOrEqual(source, match.$not);
  }
  // ... other queries
  return undefined;
}

const compare = (source: object, match: object): boolean => {
  return isMatchWith(source, match, compareQuery);
};

export default compare;
