import * as Joi from 'joi';

export interface DocumentedConfig {
  OPENAPI_TITLE?: string;
  OPENAPI_DESCRIPTION?: string;
  OPENAPI_SERVER?: string;
  OPENAPI_SERVER_DESCRIPTION?: string;
}

export const PATH_REGEX = /^[a-zA-Z0-9-_\/]+$/;

export const documentedSchema = Joi.object<DocumentedConfig>({
  OPENAPI_TITLE: Joi.string(),
  OPENAPI_DESCRIPTION: Joi.string(),
  OPENAPI_SERVER: Joi.string().pattern(PATH_REGEX),
  OPENAPI_SERVER_DESCRIPTION: Joi.string(),
});
