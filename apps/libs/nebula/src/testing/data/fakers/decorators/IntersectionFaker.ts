import storage from '../storage';
import { FakerTarget } from '../types';

export const IntersectionFaker =
  (...targets: FakerTarget[]): ClassDecorator =>
  (target) => {
    storage.copyMetadata(target as unknown as FakerTarget, ...targets);
  };
