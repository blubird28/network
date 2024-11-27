import * as Joi from 'joi';

import splitAndTrim from '../../utils/data/splitAndTrim';
import parseColumnarConfig from '../utils/parseColumnarConfig';

export interface PerCompanyConfig {
  name: string;
  ids: string[];
  hookPath: string;
}

const ID_SEPARATOR = ',';
const THREE_COLUMNS = 3;

const parsePerCompanyConfig = (value: string): PerCompanyConfig[] => {
  if (value) {
    return parseColumnarConfig(
      value,
      THREE_COLUMNS,
      ([name, hookPath, idsRaw], errSuffix) => {
        if (!name) {
          throw new Error(`First column (name) must not be blank ${errSuffix}`);
        }
        if (!hookPath) {
          throw new Error(
            `Second column (hookPath) must not be blank ${errSuffix}`,
          );
        }
        const ids = splitAndTrim(idsRaw, ID_SEPARATOR).filter(Boolean);
        return { name: name.toUpperCase(), hookPath, ids };
      },
    );
  }
  return undefined;
};

export interface SlackPerCompanyConfig {
  SLACK_PER_COMPANY_CONFIG: PerCompanyConfig[];
  SLACK_DEFAULT_HOOK_PATH: string;
}

export const slackPerCompanySchema = Joi.object<SlackPerCompanyConfig>({
  SLACK_PER_COMPANY_CONFIG: Joi.string()
    .custom(parsePerCompanyConfig)
    .default([])
    .messages({
      'any.custom': 'Failed to parse {{#label}}: {{#error.message}}',
    }),
  SLACK_DEFAULT_HOOK_PATH: Joi.string().required(),
}).required();
