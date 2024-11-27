import * as Joi from 'joi';

import {
  ConsoleEnvironment,
  LogLevel,
  NodeEnvironment,
} from '../../basic-types';
import {
  DEFAULT_CONSOLE_ENVIRONMENT,
  DEFAULT_LOG_LEVEL,
  DEFAULT_NODE_ENVIRONMENT,
  VALID_CONSOLE_ENVIRONMENTS,
  VALID_LOG_LEVELS,
  VALID_NODE_ENVIRONMENTS,
} from '../config.constants';

export interface BaseConfig {
  APP_NAME: string;
  LOG_LEVEL: LogLevel;
  NODE_ENV: NodeEnvironment;
  CONSOLE_ENV: ConsoleEnvironment;
}

export const baseSchema = Joi.object<BaseConfig>({
  APP_NAME: Joi.string().required(),
  LOG_LEVEL: Joi.string()
    .valid(...VALID_LOG_LEVELS)
    .default(DEFAULT_LOG_LEVEL),
  NODE_ENV: Joi.string()
    .valid(...VALID_NODE_ENVIRONMENTS)
    .default(DEFAULT_NODE_ENVIRONMENT),
  CONSOLE_ENV: Joi.string()
    .valid(...VALID_CONSOLE_ENVIRONMENTS)
    .default(DEFAULT_CONSOLE_ENVIRONMENT),
}).required();
