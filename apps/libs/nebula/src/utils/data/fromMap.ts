import { TransformFnParams } from 'class-transformer';

const fromMap = ({ value, obj, key }: TransformFnParams) => {
  const orig = obj[key];
  if (orig instanceof Map) {
    return Object.fromEntries(orig);
  }
  return value;
};

export default fromMap;
