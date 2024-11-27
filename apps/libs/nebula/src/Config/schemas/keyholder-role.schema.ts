import * as Joi from 'joi';

export interface KeyholderRoleConfig {
  KEYHOLDER_ROLE_ID: string;
}

export const keyholderRoleSchema = Joi.object<KeyholderRoleConfig>({
  KEYHOLDER_ROLE_ID: Joi.string().required(),
});
