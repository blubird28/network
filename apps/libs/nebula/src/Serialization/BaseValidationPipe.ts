import { filter, flatMap, flatten, map } from 'lodash';

import { Type, ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';

import * as transformer from '@libs/nebula/class-transformer';

import Errors, { BaseException, ErrorData } from '../Error';
import { MultipleErrors } from '../Error/special/MultipleErrors';
import { ErrorCode } from '../Error/constants';

const VALIDATION_DEFAULT_HTTP_STATUS = 400;

export class BaseValidationPipe extends ValidationPipe {
  constructor(type?: Type) {
    const options: ValidationPipeOptions = {
      transformerPackage: transformer,
      transform: true,
      whitelist: true,
      expectedType: type,
      transformOptions: {
        excludeExtraneousValues: true,
        exposeDefaultValues: true,
      },
      stopAtFirstError: true,
      exceptionFactory: (validationErrors) =>
        this.createException(validationErrors),
    };
    super(options);
  }

  createException(validationErrors: ValidationError[]) {
    const errors = this.getErrors(
      this.getAllValidationErrors(validationErrors),
    );
    if (errors.length === 1) {
      return errors[0];
    }
    return new MultipleErrors(errors, VALIDATION_DEFAULT_HTTP_STATUS);
  }

  getAllValidationErrors(
    validationErrors: ValidationError[],
  ): ValidationError[] {
    return flatten(
      validationErrors.map((error) =>
        this.mapChildrenToValidationErrors(error),
      ),
    );
  }

  getErrors(validationErrors: ValidationError[]): BaseException[] {
    return flatMap(validationErrors, (error) =>
      !error.constraints
        ? []
        : filter(
            map(error.constraints, (message, constraint) => {
              const code =
                error.contexts?.[constraint]?.code ||
                ErrorCode.ValidationFailed;
              const data: ErrorData = { message, property: error.property };
              return new Errors[code](data);
            }),
          ),
    );
  }
}
