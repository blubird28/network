import { isFinite, isNumber, isString } from 'lodash';

const positiveInt = (value: unknown): number | null => {
  if (!isString(value) && !isNumber(value)) {
    return null;
  }
  const numeric = parseInt(String(value), 10);
  if (!isFinite(numeric) || numeric < 0) {
    return null;
  }
  return numeric;
};

export default positiveInt;
