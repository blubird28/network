import { isString } from 'lodash';

export const VALID_BUSINESS_TYPE = Object.freeze({
  'Cloud Service Provider': 'Cloud Service Provider',
  'Data Center': 'Data Center',
  Enterprise: 'Enterprise',
  'Internet Exchange': 'Internet Exchange',
  'Carrier/Service Provider': 'Carrier/Service Provider',
  XaaS: 'XaaS',
  'IX-as-a-Service Resell': 'IX-as-a-Service Resell',
  Internal: 'Internal',
  IPX: 'IPX',
  'Mobile Network Operator (MNO)': 'Mobile Network Operator (MNO)',
  'Partner Agent': 'Partner Agent',
  'Partner DC': 'Partner DC',
  'Partner MSP/SI': 'Partner MSP/SI',
  'Partner IoT': 'Partner IoT',
  'Partner Referral': 'Partner Referral',
  'Partner Resell': 'Partner Resell',
  'Partner Technology': 'Partner Technology',
});
export type ValidBusinessType = keyof typeof VALID_BUSINESS_TYPE;

export const isValidBusinessType = (val: unknown): val is ValidBusinessType =>
  isString(val) && Object.hasOwn(VALID_BUSINESS_TYPE, val);
export const toValidBusinessType = (
  val: unknown,
): ValidBusinessType | undefined =>
  isValidBusinessType(val) ? val : undefined;
