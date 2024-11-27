import {
  isArray,
  isPlainObject,
  isString,
  template as compileTemplate,
} from 'lodash';

import { Logger } from '@nestjs/common';

import getErrorMessage from '../utils/data/getErrorMessage';
import Errors from '../Error';
import {
  isBasicType,
  SerializedData,
  SerializedObject,
  SerializedValue,
} from '../Serialization/serializes';

const INTERPOLATE_REGEX = /<%=([\s\S]+?)%>/g;

export type Template = SerializedData;
type SerializedKeyValue = [string, SerializedData];

export interface TemplateResolverOptions {
  // if true, errors when handling template strings will result in a string noting the error and original template
  // if false or not provided, errors will be thrown and template resolution will fail
  dryRun?: boolean;
}

export class TemplateResolver {
  private readonly logger = new Logger(TemplateResolver.name);
  constructor(
    private readonly inputs: object,
    private readonly imports: Record<string, unknown> = {},
    private readonly options: TemplateResolverOptions = {},
  ) {}

  resolve(value: Template): SerializedData {
    if (isString(value)) {
      return this.resolveString(value);
    }
    if (isArray(value)) {
      return this.resolveArray(value);
    }
    if (isBasicType(value)) {
      return value;
    }
    if (isPlainObject(value)) {
      return this.resolveObject(value);
    }
    return value;
  }

  private compileTemplate(template: string) {
    try {
      return compileTemplate(template, {
        imports: this.imports,
        interpolate: INTERPOLATE_REGEX,
      });
    } catch (err) {
      this.logger.error(err);
      throw new Errors.FailedToCompileTemplate({
        message: getErrorMessage(err),
        template,
      });
    }
  }
  private resolveTemplateString(value: string) {
    const template = this.compileTemplate(value);

    try {
      return template(this.inputs);
    } catch (err) {
      this.logger.error(err);
      throw new Errors.FailedToExecuteTemplate({
        message: getErrorMessage(err),
        template: value,
      });
    }
  }

  private resolveString(value: string): string {
    try {
      return this.resolveTemplateString(value);
    } catch (err) {
      this.logger.error(err);
      if (this.options?.dryRun === true) {
        if (err instanceof Errors.FailedToExecuteTemplate) {
          return `(Failed to execute) ${value}`;
        }
        if (err instanceof Errors.FailedToCompileTemplate) {
          return `(Failed to compile) ${value}`;
        }
      }
      throw err;
    }
  }
  private resolveObject(template: SerializedObject): SerializedObject {
    return Object.fromEntries<SerializedData>(
      Object.entries(template).map(this.resolveKeyValue.bind(this)),
    );
  }
  private resolveKeyValue([
    key,
    value,
  ]: SerializedKeyValue): SerializedKeyValue {
    return [key, this.resolve(value)];
  }
  private resolveArray(value: SerializedValue[]): SerializedValue[] {
    return value.map(this.resolve.bind(this));
  }
}
