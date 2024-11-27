import { get, isArray, isFunction, isNull, isObjectLike, set } from 'lodash';
import { ClassTransformOptions } from 'class-transformer';

import {
  FakerMergedValues,
  FakerOptions,
  FakerOptionsProvided,
  FakerOverrides,
  FakerPostProcessor,
  FakerTarget,
  MaybeOverrider,
  MetadataMap,
  Overrider,
} from './types';

export const CONNECT_ROOT = '.';

export const createOverrider = <T = unknown>(
  maybeOverrider: MaybeOverrider<T>,
): Overrider<T> =>
  isFunction(maybeOverrider)
    ? maybeOverrider
    : (override) => override ?? maybeOverrider;

export const mergeOverrides = <T extends FakerTarget>(
  metadata: MetadataMap,
  overrides: FakerOverrides<T> = {},
): FakerMergedValues<T> =>
  [...metadata.entries()].reduce((merged, [propertyName, meta]) => {
    const override = get(overrides, propertyName);
    if (!isNull(override)) {
      set(merged, propertyName, meta(override));
    }
    return merged;
  }, {} as FakerMergedValues<T>);

export const setAfter =
  (overrides: Record<string, unknown>): FakerPostProcessor =>
  (fake) => {
    Object.keys(overrides).forEach((key) => {
      set(fake, key, overrides[key]);
    });
  };

const DEFAULT_TRANSFORM_OPTIONS: ClassTransformOptions = {
  excludeExtraneousValues: false,
  exposeDefaultValues: true,
  exposeUnsetFields: false,
};

export const getTransformOptions = (
  metadataOptions: FakerOptions,
  { transform = {} }: FakerOptionsProvided = {},
): ClassTransformOptions => ({
  ...DEFAULT_TRANSFORM_OPTIONS,
  ...metadataOptions.transform,
  ...transform,
});

const ARRAY_SEGMENT_REGEX = /(\[]|\.)/g;
const ARRAY_SEGMENT = '[]';
const PATH_SEGMENT = '.';

const applyConnectRecursively = (target, src, pathSegments: string[]) => {
  const [segment, ...remaining] = pathSegments;
  if (segment === ARRAY_SEGMENT) {
    if (isArray(target)) {
      target.forEach((item) => applyConnectRecursively(item, src, remaining));
    }
    return;
  }
  if (remaining.length > 0) {
    const nextTarget = get(target, segment);
    if (isObjectLike(nextTarget)) {
      applyConnectRecursively(nextTarget, src, remaining);
    }
    return;
  }

  if (isObjectLike(target)) {
    set(target, segment, src);
  }
};

export const connectReferences =
  (destPath: string, srcPath: string = CONNECT_ROOT) =>
  <T extends FakerTarget>(root: InstanceType<T>) => {
    const src = srcPath === CONNECT_ROOT ? root : get(root, srcPath);
    const pathSegments = destPath
      .split(ARRAY_SEGMENT_REGEX)
      .filter((segment) => !!segment && segment !== PATH_SEGMENT);
    applyConnectRecursively(root, src, pathSegments);
  };
