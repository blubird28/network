import { ObjectSchema } from 'joi';

import { BaseConfig, baseSchema } from '../schemas/base.schema';

const combineSchemas = <T extends BaseConfig = BaseConfig>(
  schemas: Array<ObjectSchema> = [],
  base: ObjectSchema = baseSchema,
): ObjectSchema<T> => {
  if (schemas.length === 0) {
    return base;
  }
  const [next, ...rest] = schemas;
  return combineSchemas(rest, base.concat(next));
};

export default combineSchemas;
