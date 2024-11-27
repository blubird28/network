import { get, identity, isFunction } from 'lodash';
import { createMock } from '@golevelup/ts-jest';
import { PartialFuncReturn } from '@golevelup/ts-jest/lib/mocks';
import { DataSource } from 'typeorm';
import { I18nService } from 'nestjs-i18n';

import { MockFactory } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InjectionToken } from '@nestjs/common';

import { BaseConfig } from '../../Config/schemas/base.schema';

export type TokenPredicate = (token?: InjectionToken) => boolean;

// basic props for commonly automocked objects
const DATA_SOURCE_DEFAULTS: PartialFuncReturn<DataSource> = {
  entityMetadatas: [],
};

export class MockerBuilder {
  static readonly DEFAULT_PREDICATE = () => true;
  static readonly DEFAULT_FACTORY = () =>
    createMock({ ...DATA_SOURCE_DEFAULTS });
  private predicate: TokenPredicate = MockerBuilder.DEFAULT_PREDICATE;
  private factory: MockFactory = MockerBuilder.DEFAULT_FACTORY;
  private built: unknown;

  constructor(
    predicate?: TokenPredicate | undefined,
    factory?: MockFactory | undefined,
  ) {
    this.predicate = predicate ?? MockerBuilder.DEFAULT_PREDICATE;
    this.factory = factory ?? MockerBuilder.DEFAULT_FACTORY;
  }

  public withPredicate(predicate: TokenPredicate): this {
    this.predicate = predicate;
    return this;
  }

  public withFactory(factory: MockFactory): this {
    this.factory = factory;
    return this;
  }

  public test(token: InjectionToken): boolean {
    return this.predicate(token);
  }

  public build(token: InjectionToken) {
    if (!this.built) {
      this.built = this.factory(token);
    }
    return this.built;
  }

  // basic predicates:
  static tokenEquals(val: InjectionToken): TokenPredicate {
    return (token) => token === val;
  }

  public forToken(val: InjectionToken): this {
    this.withPredicate(MockerBuilder.tokenEquals(val));
    return this;
  }

  static tokenIsFunction(): TokenPredicate {
    return (token) => isFunction(token);
  }

  public forFunctionTokens(): this {
    this.withPredicate(MockerBuilder.tokenIsFunction());
    return this;
  }

  public forAllTokens(): this {
    this.withPredicate(MockerBuilder.DEFAULT_PREDICATE);
    return this;
  }

  // Common full mockers:
  static mockConfig<T = BaseConfig>(config: Partial<T>) {
    return new this(MockerBuilder.tokenEquals(ConfigService), () =>
      MockerBuilder.mockConfigService(config),
    );
  }

  static mockConfigService<T = BaseConfig>(config: Partial<T>) {
    return createMock<ConfigService<BaseConfig & T>>({
      get: (path: string) => get(config, path),
    });
  }

  static mockI18n() {
    return new this(
      MockerBuilder.tokenEquals(I18nService),
      this.mockI18nService,
    );
  }

  static mockI18nService() {
    return createMock<I18nService>({
      t: identity,
      translate: identity,
    });
  }
}
