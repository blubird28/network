import { I18nContext, TranslateOptions } from 'nestjs-i18n';
import { I18nTranslator } from 'nestjs-i18n/dist/interfaces/i18n-translator.interface';
import { isString } from 'lodash';

import { ArgumentsHost } from '@nestjs/common';

import { getFallbackI18n } from '@libs/nebula/i18n';
import { isErrorCode } from '@libs/nebula/Error/error-codes';

import { getTracer } from '../Tracer';

import { DEFAULT_HTTP_STATUS, ErrorCode } from './constants';

export type ValidatorContext = {
  code: ErrorCode;
  httpStatus?: number;
};
export type ErrorData = TranslateOptions['args'];

export interface ExceptionType<T extends BaseException = BaseException>
  extends Function {
  new (data?: ErrorData): T;

  context: ValidatorContext;
}

export interface SharedError {
  code: ErrorCode;
  message: string;
  httpStatus: number;
  data: ErrorData;
  transactionId: string;
}

export const isSharedError = (test: unknown): test is SharedError => {
  return test && isErrorCode(test['code']) && isString(test['message']);
};

export class BaseException extends Error {
  translatedMessage: string;

  constructor(
    public code: ErrorCode = ErrorCode.Unknown,
    public httpStatus: number = DEFAULT_HTTP_STATUS,
    public data: ErrorData = {},
  ) {
    super();
    this.translateMessageWithContext();
  }

  get message() {
    return this.getMessage();
  }

  toObject(): SharedError {
    return {
      code: this.code,
      httpStatus: this.httpStatus,
      data: this.data,
      message: this.getMessage(),
      transactionId: getTracer().getTransactionId(),
    };
  }

  getMessage(): string {
    if (!this.translatedMessage) {
      this.translateMessageWithContext();
    }

    return this.translatedMessage || this.code;
  }

  getTranslationKey() {
    return `error.${this.code}`;
  }

  translateMessageWithContext(context?: ArgumentsHost) {
    this.translateMessage(this.getI18n(context));
  }

  translateMessage(i18n?: I18nTranslator) {
    const translated = this.getTranslatedMessage(i18n);
    if (typeof translated === 'string') {
      this.translatedMessage = translated;
    }
  }

  getTranslatedMessage(i18n?: I18nTranslator): string | void {
    try {
      return i18n?.translate(this.getTranslationKey(), {
        args: this.data,
      });
    } catch (_ignored) {
      // If we cannot translate the error message for whatever reason, we will just use the code
    }
  }

  getI18n(context?: ArgumentsHost): I18nTranslator | null {
    return I18nContext.current(context) || getFallbackI18n();
  }
}
