import zeroOrMore, { ZeroOrMore } from '../../../utils/data/zeroOrMore';

import {
  FakerOptions,
  FakerOptionsProvided,
  FakerPostProcessor,
  FakerProperty,
  FakerTarget,
  MetadataByTarget,
  MetadataMap,
  Overrider,
} from './types';

class AutoFakerMetadataStorage {
  private propertyMetadata: Map<FakerTarget, MetadataMap> = new Map();
  private optionsMetadata: Map<FakerTarget, FakerOptions> = new Map();
  private ancestorsMap: Map<FakerTarget, FakerTarget[]> = new Map();

  public emptyFakerOptions(): FakerOptions {
    return {
      transform: {},
      postProcess: [],
    };
  }

  public createFakerOptions(options: FakerOptionsProvided): FakerOptions {
    return this.mergeFakerOptions(this.emptyFakerOptions(), options);
  }

  public mergeFakerOptions(
    base: FakerOptions,
    overrides: FakerOptionsProvided,
  ): FakerOptions {
    return {
      transform: { ...base.transform, ...(overrides?.transform || {}) },
      postProcess: this.mergePostProcessors(
        base.postProcess,
        overrides?.postProcess,
      ),
    };
  }

  public addPropertyMetadata(
    target: FakerTarget,
    propertyName: FakerProperty,
    value: Overrider,
  ) {
    this.getPropertyMetadataInternal(target).set(propertyName, value);
  }

  public addOptionsMetadata(target: FakerTarget, value: FakerOptionsProvided) {
    this.optionsMetadata.set(target, this.createFakerOptions(value));
  }

  public getMetadataByTarget(target: FakerTarget): MetadataByTarget {
    return {
      options: this.mergeAncestorOptionsMeta(target),
      properties: this.mergeAncestorPropertiesMeta(target),
    };
  }

  public copyMetadata(dest: FakerTarget, ...sources: FakerTarget[]) {
    this.propertyMetadata.set(
      dest,
      this.mergePropertiesMeta(
        this.getPropertyMetadataInternal(dest),
        ...sources.map((src) => this.mergeAncestorPropertiesMeta(src)),
      ),
    );
    this.optionsMetadata.set(dest, this.mergeOptionsMeta(dest, ...sources));
  }

  private mergeAncestorOptionsMeta(target: FakerTarget): FakerOptions {
    return this.mergeOptionsMeta(target, ...this.getAncestors(target));
  }

  private mergeOptionsMeta(...targets: FakerTarget[]): FakerOptions {
    return targets.reduceRight<FakerOptions | null>(
      (acc, curr) =>
        this.mergeFakerOptions(acc, this.optionsMetadata.get(curr)),
      this.emptyFakerOptions(),
    );
  }

  private iterateMapSafely(
    map: MetadataMap | undefined,
    callback: (propertyName: FakerProperty, overrider: Overrider) => void,
  ) {
    map?.forEach((overrider, propertyName) =>
      callback(propertyName, overrider),
    );
  }

  private mergeAncestorPropertiesMeta(target: FakerTarget): MetadataMap {
    return this.mergePropertiesMeta(
      this.getPropertyMetadataInternal(target),
      ...this.getAncestors(target)
        .map((ancestor) => this.propertyMetadata.get(ancestor))
        .filter(Boolean),
    );
  }

  private mergePropertiesMeta(...metadatas: MetadataMap[]): MetadataMap {
    const mergedProps: MetadataMap = new Map();
    metadatas.forEach((metadata) => {
      this.iterateMapSafely(metadata, (prop, overrider) => {
        if (!mergedProps.has(prop)) {
          mergedProps.set(prop, overrider);
        }
      });
    });

    return mergedProps;
  }

  private getAncestors(target: FakerTarget) {
    if (!target) return [];
    if (!this.ancestorsMap.has(target)) {
      const ancestor = Object.getPrototypeOf(target);
      this.ancestorsMap.set(target, [ancestor, ...this.getAncestors(ancestor)]);
    }
    return this.ancestorsMap.get(target);
  }

  private getPropertyMetadataInternal(target: FakerTarget): MetadataMap {
    if (!this.propertyMetadata.has(target)) {
      this.propertyMetadata.set(target, new Map());
    }
    return this.propertyMetadata.get(target);
  }

  private mergePostProcessors(
    base: FakerPostProcessor[],
    additional: ZeroOrMore<FakerPostProcessor>,
  ): FakerPostProcessor[] {
    return [...base, ...zeroOrMore(additional)];
  }
}

const storage = new AutoFakerMetadataStorage();
export default storage;
