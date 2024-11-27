import { ConsoleEnvironment, LogLevel, NodeEnvironment } from '../basic-types';

export const VALID_LOG_LEVELS: LogLevel[] = [
  'error',
  'warn',
  'info',
  'http',
  'verbose',
  'debug',
  'silly',
];
export const DEFAULT_LOG_LEVEL: LogLevel = 'info';
export const VALID_NODE_ENVIRONMENTS: NodeEnvironment[] = [
  'test',
  'development',
  'production',
];
export const DEFAULT_NODE_ENVIRONMENT: NodeEnvironment = 'development';
export const VALID_CONSOLE_ENVIRONMENTS: ConsoleEnvironment[] = [
  'development',
  'uat',
  'stage',
  'production',
];
export const DEFAULT_CONSOLE_ENVIRONMENT: ConsoleEnvironment = 'development';
export const DEFAULT_PRICE_TIMECODE_TTL = 86400000; // 1 day in milliseconds
export const DEFAULT_SENDGRID_TEMPLATE_CACHE_TTL = 86400000; // 1 day in milliseconds
export const DEFAULT_MAX_STRING_LENGTH = 120;
