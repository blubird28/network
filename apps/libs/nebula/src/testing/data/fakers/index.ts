import { plainToInstance } from '@libs/nebula/class-transformer';

import { FakerOptionsProvided, FakerOverrides, FakerTarget } from './types';
import storage from './storage';
import { getTransformOptions, mergeOverrides } from './helpers';

export const faker = <T extends FakerTarget>(
  target: T,
  overrides: FakerOverrides<T> = {},
  passedOptions: FakerOptionsProvided = {},
): InstanceType<T> => {
  const meta = storage.getMetadataByTarget(target);
  const options = storage.mergeFakerOptions(meta.options, passedOptions);
  const plain = mergeOverrides(meta.properties, overrides);

  const instance: InstanceType<T> = plainToInstance(
    target,
    plain,
    getTransformOptions(meta.options, options),
  );

  return options.postProcess.reduce<InstanceType<T>>(
    (curr, processor) => processor(curr) || curr,
    instance,
  );
};

const getNullOverrides = <T extends FakerTarget>(
  target: T,
): FakerOverrides<T> =>
  [...storage.getMetadataByTarget(target).properties.keys()]
    .filter((prop) => prop !== 'id')
    .reduce((acc, prop) => ({ ...acc, [prop]: null }), {});

export const nullFaker = <T extends FakerTarget>(
  target: T,
  overrides: FakerOverrides<T> = {},
  passedOptions: FakerOptionsProvided = {},
) =>
  faker(target, { ...getNullOverrides(target), ...overrides }, passedOptions);

const DATE_FIELDS = ['createdAt', 'deletedAt', 'updatedAt'];
const noDateOverrides = <T extends FakerTarget>(target: T): FakerOverrides<T> =>
  [...storage.getMetadataByTarget(target).properties.keys()]
    .filter((prop) => DATE_FIELDS.includes(prop))
    .reduce((acc, prop) => ({ ...acc, [prop]: null }), {});

export const noDatesFaker = <T extends FakerTarget>(
  target: T,
  overrides: FakerOverrides<T> = {},
  passedOptions: FakerOptionsProvided = {},
) => faker(target, { ...noDateOverrides(target), ...overrides }, passedOptions);

export * from './decorators';
