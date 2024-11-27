import { MockFactory } from '@nestjs/testing';
import { InjectionToken } from '@nestjs/common';

import { BaseConfig } from '../../Config/schemas/base.schema';

import { MockerBuilder } from './mocker.builder';

export class Mocker {
  private readonly builders: MockerBuilder[];
  constructor(...factoriesOrTokens: (MockerBuilder | InjectionToken)[]) {
    this.builders = factoriesOrTokens.map((factoryOrToken) =>
      factoryOrToken instanceof MockerBuilder
        ? factoryOrToken
        : new MockerBuilder().forToken(factoryOrToken),
    );
  }

  add(builder: MockerBuilder) {
    this.builders.push(builder);
    return this;
  }

  public mock(): MockFactory {
    return (token) =>
      this.builders.find((factory) => factory.test(token))?.build(token);
  }

  static auto(): MockFactory {
    return new Mocker(new MockerBuilder()).mock();
  }

  static service(token: InjectionToken): MockFactory {
    return new Mocker(new MockerBuilder().forToken(token)).mock();
  }

  static services(...tokens: InjectionToken[]): MockFactory {
    return new Mocker(
      ...tokens.map((token) => new MockerBuilder().forToken(token)),
    ).mock();
  }

  static config<T = BaseConfig>(config: Partial<T>): MockFactory {
    return new Mocker(MockerBuilder.mockConfig(config)).mock();
  }

  static i18n(): MockFactory {
    return new Mocker(MockerBuilder.mockI18n()).mock();
  }
}
