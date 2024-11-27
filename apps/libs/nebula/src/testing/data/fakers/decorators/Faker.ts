import { merge } from 'lodash';

import storage from '../storage';
import { FakerOptionsProvided, FakerTarget } from '../types';

export const Faker =
  (options: FakerOptionsProvided = {}): ClassDecorator =>
  (target) => {
    storage.addOptionsMetadata(target as unknown as FakerTarget, options);
  };

export const DTOFaker =
  (options: FakerOptionsProvided = {}): ClassDecorator =>
  (target) => {
    storage.addOptionsMetadata(
      target as unknown as FakerTarget,
      merge({}, { transform: { excludeExtraneousValues: true } }, options),
    );
  };
