import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import {
  isSerializedData,
  isSerializedObject,
  SerializedData,
  SerializesWith,
} from '../Serialization/serializes';
import { DeserializesWith } from '../Serialization/deserializes';

const cast = (val: unknown) =>
  val instanceof SerializedDataDto ? val : new SerializedDataDto(val);

const convert = (_source: unknown, value: unknown): SerializedData =>
  cast(value).getData();

@SerializesWith(convert)
@DeserializesWith(convert)
export class SerializedDataDto {
  private readonly data: SerializedData;

  constructor(data: unknown) {
    this.data = data as SerializedData;
  }

  getData(): SerializedData {
    return this.data;
  }

  toJSON() {
    return this.getData();
  }
}

@ValidatorConstraint()
export class ValidSerializedObject implements ValidatorConstraintInterface {
  validate(value): boolean {
    return isSerializedObject(value);
  }

  defaultMessage(): string {
    return 'Must be a valid SerializedObject';
  }
}
@ValidatorConstraint()
export class ValidSerializedData implements ValidatorConstraintInterface {
  validate(value): boolean {
    return isSerializedData(value);
  }

  defaultMessage(): string {
    return 'Must be a valid SerializedData';
  }
}
