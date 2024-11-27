import axios, { AxiosRequestConfig } from 'axios';
import { get, isDate, isNaN, isNumber, isString } from 'lodash';

import { Logger } from '@nestjs/common';

import getErrorMessage from '@libs/nebula/utils/data/getErrorMessage';
import positiveInt from '@libs/nebula/utils/data/positive-int';
import { SECOND_IN_MILLIS } from '@libs/nebula/basic-types';

export interface TokenFetcher {
  getToken(): string | Promise<string>;
}

export enum ExpiryFormat {
  // The expiry is a date object or json datetime string
  ISO = 'ISO',
  // The expiry is the number of milliseconds since the unix epoch
  TIMESTAMP = 'TIMESTAMP',
  // The expiry is the number of seconds since the unix epoch
  TIMESTAMP_SECONDS = 'TIMESTAMP_SECONDS',
  // The expiry is a number of seconds since the creation of the token
  LIFETIME_SECONDS = 'LIFETIME_SECONDS',
  // The expiry is a number of milliseconds since the creation of the token
  LIFETIME_MILLIS = 'LIFETIME_MILLIS',
}

interface TokenFetcherConfig {
  // The Axios Request Config describing a call to fetch a key
  request: AxiosRequestConfig;
  // The property of the response in which the access token can be found
  tokenKey: string;
  // The property of the response in which the key's expiry information can be found
  expiryKey: string;
  // The format the expiry information can be expected in
  expiryFormat: ExpiryFormat;
  // A number of seconds to bring forward the token's expiry by (to ensure we do not use tokens which are about to expire)
  expireEarly: number;
  logger?: string | Logger;
}

export class TokenFetcherService implements TokenFetcher {
  private readonly logger: Logger;
  private readonly tokenKey: string;
  private readonly expiryKey: string;
  private readonly expiryFormat: ExpiryFormat;
  private readonly expireEarly: number;
  private readonly request: AxiosRequestConfig;
  private token: string | null = null;
  private tokenExpiry: number | null = null;
  constructor({
    tokenKey,
    expiryKey,
    expiryFormat,
    expireEarly,
    logger = TokenFetcherService.name,
    request,
  }: TokenFetcherConfig) {
    this.tokenKey = tokenKey;
    this.expiryKey = expiryKey;
    this.expiryFormat = expiryFormat;
    this.expireEarly = expireEarly;
    this.request = request;
    this.logger = isString(logger) ? new Logger(logger) : logger;
  }

  async getToken(): Promise<string> {
    if (this.shouldFetch()) {
      await this.fetchAndUpdateToken();
    }
    return this.token;
  }

  async fetchAndUpdateToken() {
    const requestTimestamp = Date.now();
    const tokenResponse = await this.fetchToken();
    this.logger?.log('Fetched token response');
    const token = get(tokenResponse.data, this.tokenKey);
    const expiry = get(tokenResponse.data, this.expiryKey);
    const expiryTimestamp = this.getExpiryTimestamp(expiry, requestTimestamp);
    if (
      token &&
      expiryTimestamp &&
      isString(token) &&
      isNumber(expiryTimestamp)
    ) {
      this.token = token;
      this.tokenExpiry = expiryTimestamp;
      this.logger?.log(`Updated token and expiry`);
    } else {
      this.logger?.error(
        'Failed to parse a valid token and expiry from the token response',
      );
    }
  }

  private shouldFetch(): boolean {
    return !this.token || !this.tokenExpiry || this.tokenExpiry < Date.now();
  }

  private async fetchToken() {
    try {
      this.logger?.log('Fetching new token');
      return await axios.request(this.request);
    } catch (err) {
      this.logger?.error(
        `Failed to fetch a new token! ${getErrorMessage(err)}`,
      );
      throw err;
    }
  }

  private getEarlyExpiryMillis() {
    return (positiveInt(this.expireEarly) || 0) * SECOND_IN_MILLIS;
  }

  private getExpiryTimestamp(
    value: unknown,
    requestTimestamp: number,
  ): number | null {
    if (!value) {
      return null;
    }
    const expiryTimestamp =
      TokenFetcherService.EXPIRY_STRATEGIES[this.expiryFormat]?.(
        value,
        requestTimestamp,
      ) ?? null;
    return expiryTimestamp
      ? expiryTimestamp - this.getEarlyExpiryMillis()
      : null;
  }

  static readonly EXPIRY_STRATEGIES: Record<
    ExpiryFormat,
    (value: unknown, relativeTo: number) => number | null
  > = Object.freeze({
    [ExpiryFormat.ISO]: (value) => {
      if (isString(value) || isDate(value)) {
        const timestamp = new Date(value).getTime();
        if (!isNaN(timestamp)) {
          return timestamp;
        }
      }
      return null;
    },
    [ExpiryFormat.TIMESTAMP_SECONDS]: (value) => {
      const numeric = positiveInt(value);
      if (numeric) {
        return numeric * SECOND_IN_MILLIS;
      }
      return null;
    },
    [ExpiryFormat.TIMESTAMP]: (value) => {
      const numeric = positiveInt(value);
      if (numeric) {
        return numeric;
      }
      return null;
    },
    [ExpiryFormat.LIFETIME_SECONDS]: (value, relativeTo) => {
      const numeric = positiveInt(value);
      if (numeric) {
        return relativeTo + numeric * SECOND_IN_MILLIS;
      }
      return null;
    },
    [ExpiryFormat.LIFETIME_MILLIS]: (value, relativeTo) => {
      const numeric = positiveInt(value);
      if (numeric) {
        return relativeTo + numeric;
      }
      return null;
    },
  });
}
