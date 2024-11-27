export type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

export type NodeEnvironment = 'test' | 'development' | 'production';
export type ConsoleEnvironment = 'development' | 'uat' | 'stage' | 'production';

export enum CamundaDataType {
  string = 'String',
  number = 'Double',
  boolean = 'Boolean',
  null = 'Null',
}
export type AttributeType = string | number | boolean | null;
export type AttributeRecord = Record<string, AttributeType>;
export type CamundaVariable = {
  type: string;
  value: AttributeType;
  valueInfo?: unknown;
};
export type CamundaVariables = Record<string, CamundaVariable>;

export const SECOND_IN_MILLIS = 1000;
export const MINUTE_IN_SECONDS = 60;
export const HOUR_IN_MINUTES = 60;
export const DAY_IN_HOURS = 24;
export const WEEK_IN_DAYS = 7;
