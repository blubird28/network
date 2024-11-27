import Base = require('class-transformer/cjs/TransformOperationExecutor');
import { TransformationType, TypeMetadata } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

import { Type } from '@nestjs/common';

import {
  hasSerializer,
  SERIALIZE,
  Serialized,
} from '@libs/nebula/Serialization/serializes';
import {
  DESERIALIZE,
  hasDeserializer,
} from '@libs/nebula/Serialization/deserializes';

export type BoundTransform = (
  value: unknown,
  targetType: Type | TypeMetadata,
  source?: unknown,
  arrayType?: Type,
  isMap?: boolean,
) => unknown;

export class TransformOperationExecutor extends Base.TransformOperationExecutor {
  private readonly type: TransformationType;
  constructor(
    transformationType: TransformationType,
    options: ClassTransformOptions,
  ) {
    super(transformationType, options);
    this.type = transformationType;
  }

  transform(
    source: unknown,
    value: unknown,
    targetType: Type | TypeMetadata,
    arrayType: Type,
    isMap: boolean,
    level?: number,
  ): unknown {
    const boundTransform: BoundTransform = (
      value,
      targetType,
      source,
      arrayType = undefined,
      isMap = false,
    ) => this.transform(source, value, targetType, arrayType, isMap, level + 1);
    if (this.type === TransformationType.CLASS_TO_PLAIN) {
      if (value instanceof Serialized) {
        return value.getData();
      } else if (hasSerializer(targetType)) {
        return new Serialized(
          targetType[SERIALIZE](source, value, this.type, boundTransform),
        ).getData();
      }
    } else if (hasDeserializer(targetType)) {
      return targetType[DESERIALIZE](source, value, this.type, boundTransform);
    }
    return super.transform(source, value, targetType, arrayType, isMap, level);
  }
}
