import * as Joi from 'joi';

export interface ElasticSearchConfig {
  ELASTICSEARCH_NODE: string;
  ELASTICSEARCH_API_KEY?: string;
}

export const elasticSearchSchema = Joi.object<ElasticSearchConfig>({
  ELASTICSEARCH_NODE: Joi.string().uri().required(),
  ELASTICSEARCH_API_KEY: Joi.string().allow(''),
}).required();
