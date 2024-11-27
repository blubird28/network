import { ClsServiceManager } from 'nestjs-cls';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { CanActivate, ExecutionContext } from '@nestjs/common';

import { I18N_CLS_KEY } from './constants';
import { ClsI18n } from './cls.interface';

export class I18nClsSetup implements CanActivate {
  constructor(private readonly i18n: I18nService) {}
  canActivate(context: ExecutionContext): boolean {
    const cls = ClsServiceManager.getClsService<ClsI18n>();
    cls.set(I18N_CLS_KEY, I18nContext.current(context) || this.i18n);
    return true;
  }
}
