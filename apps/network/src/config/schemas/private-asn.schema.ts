import * as Joi from 'joi';
const defaultRangeStart = 4200000000;
const defaultRangeEnd = 4294967294;
const defaultAmtToGenerate = 20;
const defaultQuarantinePeriod = 3;

export interface PrivateASNConfig {
  PRIVATE_ASN_RANGE_START: number;
  PRIVATE_ASN_RANGE_END: number;
  PRIVATE_ASN_AMT_TO_GENERATE: number;
  QUARANTINE_PERIOD_MONTHS: number;
}

export const privateASNSchema = Joi.object<PrivateASNConfig>({
  PRIVATE_ASN_RANGE_START: Joi.number()
    .positive()
    .integer()
    .default(defaultRangeStart)
    .required(),
  PRIVATE_ASN_RANGE_END: Joi.number()
    .positive()
    .integer()
    .default(defaultRangeEnd)
    .required()
    .greater(Joi.ref('PRIVATE_ASN_RANGE_START')),
  PRIVATE_ASN_AMT_TO_GENERATE: Joi.number()
    .positive()
    .integer()
    .default(defaultAmtToGenerate)
    .required()
    .greater(0),
  QUARANTINE_PERIOD_MONTHS: Joi.number()
    .positive()
    .integer()
    .default(defaultQuarantinePeriod)
    .required()
    .greater(0),
}).required();
