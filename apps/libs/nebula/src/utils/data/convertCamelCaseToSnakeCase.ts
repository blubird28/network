import { isArray, isDate, isObject, snakeCase } from 'lodash';

const convertCamelCaseToSnakeCase = function <T>(input: T): T {
  return (function recurse(input) {
    if (isObject(input) && !isArray(input) && !isDate(input)) {
      return Object.keys(input).reduce((acc, key) => {
        return Object.assign(acc, { [snakeCase(key)]: recurse(input[key]) });
      }, {});
    } else if (isArray(input)) {
      return input.map((i) => recurse(i));
    }
    return input;
  })(input);
};

export default convertCamelCaseToSnakeCase;
