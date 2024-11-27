import * as Joi from 'joi';

export interface PostgresConfig {
  POSTGRES_HOST: string;
  POSTGRES_PORT: number;
  POSTGRES_NAME: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_CA_PATH: string;
  POSTGRES_CERT_PATH: string;
  POSTGRES_KEY_PATH: string;
}

export const postgresSchema = Joi.object<PostgresConfig>({
  POSTGRES_HOST: Joi.string().hostname().required(),
  POSTGRES_PORT: Joi.number().integer().positive().required(),
  POSTGRES_NAME: Joi.string().required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_CA_PATH: Joi.string(),
  POSTGRES_CERT_PATH: Joi.string(),
  POSTGRES_KEY_PATH: Joi.string(),
})
  .and('POSTGRES_CA_PATH', 'POSTGRES_CERT_PATH', 'POSTGRES_KEY_PATH')
  .required();
