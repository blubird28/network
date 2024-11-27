import { ClsStore, Terminal } from 'nestjs-cls';
import { I18nTranslator } from 'nestjs-i18n/dist/interfaces/i18n-translator.interface';

import { I18N_CLS_KEY } from './constants';

export interface ClsI18n extends ClsStore {
  [I18N_CLS_KEY]?: Terminal<I18nTranslator>;
}
