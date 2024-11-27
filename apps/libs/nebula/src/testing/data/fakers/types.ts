import { ClassTransformOptions } from 'class-transformer';

import { OneOrMore } from '../../../utils/data/oneOrMore';

export type Overrider<T = unknown> = (val?: T) => T;
export type MaybeOverrider<T = unknown> = T | Overrider<T>;
export type FakerProperty = string;
export type FakerTarget = new (...args: any) => any;
export type MetadataMap = Map<FakerProperty, Overrider>;
export type FakerPostProcessor<T extends FakerTarget = any> = (
  fake: InstanceType<T>,
) => void | InstanceType<T>;
export type FakerOptions = {
  transform: Partial<ClassTransformOptions>;
  postProcess: FakerPostProcessor[];
};
export type FakerOptionsProvided = {
  transform?: Partial<ClassTransformOptions>;
  postProcess?: OneOrMore<FakerPostProcessor>;
};
export type MetadataByTarget = {
  properties: MetadataMap;
  options: FakerOptions;
};
export type FakerOverrides<T extends FakerTarget> = Partial<InstanceType<T>>;
export type FakerMergedValues<T extends FakerTarget> = Record<
  keyof InstanceType<T>,
  any
>;
