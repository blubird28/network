import { FakerTarget, MaybeOverrider } from '../types';
import storage from '../storage';
import { createOverrider } from '../helpers';

export const createFakerDecorator =
  <T>(meta: MaybeOverrider<T>) =>
  (target, propertyName) => {
    storage.addPropertyMetadata(
      target.constructor as FakerTarget,
      propertyName,
      createOverrider(meta),
    );
  };
