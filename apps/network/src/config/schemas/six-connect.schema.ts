import * as Joi from 'joi';

export interface SixConnectConfig {
  SIXCONNECT_LINKNET_RESOURCE_ID: number;
  SIXCONNECT_LINKNET_ASSIGNED_RESOURCE_ID: number;
  SIXCONNECT_LINKNET_TAGS: string;
  SIXCONNECT_PUBLIC_RESOURCE_ID: number;
  SIXCONNECT_PUBLIC_ASSIGNED_RESOURCE_ID: number;
  SIXCONNECT_PUBLIC_TAGS: string;
}

export const sixConnectSchema = Joi.object<SixConnectConfig>({
  SIXCONNECT_LINKNET_RESOURCE_ID: Joi.number().positive().integer().required(),
  SIXCONNECT_LINKNET_ASSIGNED_RESOURCE_ID: Joi.number()
    .positive()
    .integer()
    .required(),
  SIXCONNECT_LINKNET_TAGS: Joi.string().required(),
  SIXCONNECT_PUBLIC_RESOURCE_ID: Joi.number().positive().integer().required(),
  SIXCONNECT_PUBLIC_ASSIGNED_RESOURCE_ID: Joi.number()
    .positive()
    .integer()
    .required(),
  SIXCONNECT_PUBLIC_TAGS: Joi.string().required(),
}).required();
