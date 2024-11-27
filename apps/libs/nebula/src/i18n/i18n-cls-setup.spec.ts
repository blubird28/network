import * as Cls from 'nestjs-cls';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClsService } from 'nestjs-cls';

import { ExecutionContext } from '@nestjs/common';

import { I18nClsSetup } from './i18n-cls-setup';
import { I18N_CLS_KEY } from './constants';

jest.mock('nestjs-cls');
const serviceManagerMock = jest.mocked(Cls.ClsServiceManager);

describe('I18n Cls Setup', () => {
  let cls: DeepMocked<ClsService>;
  let i18n: DeepMocked<I18nService<unknown>>;
  let instance: I18nClsSetup;
  let context: DeepMocked<ExecutionContext>;
  beforeEach(() => {
    jest.resetAllMocks();
    cls = createMock<ClsService>();
    i18n = createMock<I18nService<unknown>>();
    context = createMock<ExecutionContext>();
    serviceManagerMock.getClsService.mockReturnValue(cls);
    instance = new I18nClsSetup(i18n);
  });

  it('Adds the i18n context, if it exists, to the Cls store', () => {
    expect.hasAssertions();
    const i18nContext = new I18nContext<unknown>('en', i18n);
    jest.spyOn(I18nContext, 'current').mockReturnValue(i18nContext);

    expect(instance.canActivate(context)).toBe(true);

    expect(I18nContext.current).toHaveBeenCalledWith(context);
    expect(cls.set).toHaveBeenCalledWith(I18N_CLS_KEY, i18nContext);
  });
  it('Adds the i18n service, if the context does not exist, to the Cls store', () => {
    expect.hasAssertions();
    jest.spyOn(I18nContext, 'current').mockReturnValue(undefined);

    expect(instance.canActivate(context)).toBe(true);

    expect(I18nContext.current).toHaveBeenCalledWith(context);
    expect(cls.set).toHaveBeenCalledWith(I18N_CLS_KEY, i18n);
  });
});
