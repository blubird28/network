import * as Joi from 'joi';

export interface SlackHookConfig {
  SLACK_BASE_URL: string; // Probably https://hooks.slack.com
  SLACK_HOOK_DEFAULT_COLOUR: string; // Probably #c9c9c9
}

export const slackHookSchema = Joi.object<SlackHookConfig>({
  SLACK_BASE_URL: Joi.string().uri().required(),
  SLACK_HOOK_DEFAULT_COLOUR: Joi.string().default('#c9c9c4'),
}).required();
