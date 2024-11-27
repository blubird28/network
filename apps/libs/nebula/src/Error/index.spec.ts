import { createMock } from '@golevelup/ts-jest';
import { I18nContext } from 'nestjs-i18n';

import { KEY_TO_FACTORY_PARAMS } from './Errors.proxy';

import Errors, { ErrorCode, ErrorKey } from '.';

jest.mock('nestjs-i18n', () => ({
  I18nContext: {
    current: jest.fn(),
  },
}));
describe('Errors', () => {
  const mockI18n = createMock<I18nContext<unknown>>({
    translate: (code) => code,
  });
  beforeEach(() => {
    (
      I18nContext.current as jest.MockedFn<() => I18nContext<unknown>>
    ).mockReturnValue(mockI18n);
  });

  [...KEY_TO_FACTORY_PARAMS.keys()].forEach((key) => {
    it(`${key}Error`, () => {
      expect.hasAssertions();

      const errorByKey = new Errors[key]({ foo: 'bar' });
      const errorByCode = new Errors[ErrorCode[key]]({ foo: 'bar' });

      expect(errorByKey).toStrictEqual(errorByCode);
      expect(errorByKey.toObject()).toStrictEqual(errorByCode.toObject());
      expect(errorByKey.toObject()).toMatchSnapshot();
    });
  });

  it('Falls back to Unknown', () => {
    expect.hasAssertions();

    const key = 'ErroneousError' as ErrorKey;

    const error = new Errors[key]({ foo: 'bar' });

    expect(error.toObject()).toMatchSnapshot();
  });

  it('MultipleErrors', () => {
    expect.hasAssertions();

    const error = new Errors.MultipleErrors([
      new Errors.Unknown(),
      new Errors.CompanyNotFound(),
      new Errors.InvalidPagination(),
    ]);

    expect(error.toObject()).toMatchSnapshot();
  });
});
