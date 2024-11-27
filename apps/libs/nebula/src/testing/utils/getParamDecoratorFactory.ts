import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CustomParamFactory } from '@nestjs/common/interfaces';

/*
 * For testing decorators created with nestjs' createParamDecorator()
 * returns the factory function which will be called to get the parameter value
 * The factory function takes the form: (data: D, ctx: ExecutionContext) => T
 * Where data is the first argument passed to the decorator
 * And the return value is the resolved parameter (or a Promise or Observable which will resolve to it)
 */

export const getParamDecoratorFactory = (
  decorator: () => ParameterDecorator,
): CustomParamFactory => {
  class Test {
    public test(@decorator() arg: unknown) {
      return arg;
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
};
