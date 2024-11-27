import { ClsServiceManager } from 'nestjs-cls';

import { I18N_CLS_KEY } from './constants';
import { ClsI18n } from './cls.interface';

export const getFallbackI18n = () => {
  return ClsServiceManager.getClsService<ClsI18n>().get(I18N_CLS_KEY);
};
