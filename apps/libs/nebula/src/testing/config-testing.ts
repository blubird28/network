import path from 'path';
import fs from 'fs';

import * as dotenv from 'dotenv';
import Joi from 'joi';

import getConfigLocations from '../Config/utils/getConfigLocations';
import combineSchemas from '../Config/utils/combineSchemas';

export const testSchemaForEnv = (
  schema: Joi.ObjectSchema,
  appName: string,
  env: string,
) => {
  const config = getConfigLocations(appName, env)
    .map((file) => path.resolve(process.cwd(), file))
    .filter(fs.existsSync)
    .reduce(
      (curr, file) => ({
        ...dotenv.parse(fs.readFileSync(file)),
        ...curr,
      }),
      {},
    );

  const { error } = schema.validate(config, {
    stripUnknown: true,
    abortEarly: false,
  });
  expect(error).toBeUndefined();
};

const LINE_BREAKS = /\r?\n/;
// const SET_ENV_VAR=/^[A-Za-z0-9\-_]+=(?:[^\s"].*[^\s"])?$/;
// const EMPTY=/^\s*$/;
// const COMMENT=/^\s*#.*$/;
// ^ Every line must be one of these

const ENV_VAR_NAME = /[a-z][a-z\d\-_]*/i;
const NOT_SPACE_OR_QUOTE = /[^\s"]/i;
// Env var value must be either a string not wrapped in spaces or quotes, or a single character which is not a space or quote.
const ENV_VAR_VALUE = new RegExp(
  `${NOT_SPACE_OR_QUOTE.source}.*${NOT_SPACE_OR_QUOTE.source}|${NOT_SPACE_OR_QUOTE.source}`,
  'i',
);
const ENV_VAR = new RegExp(
  `${ENV_VAR_NAME.source}=(?:${ENV_VAR_VALUE.source})?`,
  'i',
);
const EMPTY_OR_COMMENT = /\s*(?:#.*)?/;

const VALID_LINE = new RegExp(
  `^(?:${ENV_VAR.source}|${EMPTY_OR_COMMENT.source})$`,
  'i',
);
// VALID_LINE needs to be multiple lines instead of just one in order to appease SonarCloud

const ERROR_DESCRIPTION =
  'Each line in dry-run.env must be empty, a comment, or in the form:\nVAR=value goes here\n(no spaces around the equal sign, or quotes around the value)';

export const testSchemaForDryRunFile = (
  file: string,
  schema: Joi.ObjectSchema,
) => {
  expect(fs.existsSync(file)).toBe(true);

  const buffer = fs.readFileSync(file);

  const config = dotenv.parse(buffer);

  const { error } = schema.validate(config, {
    stripUnknown: true,
    abortEarly: false,
  });
  expect(error).toBeUndefined();

  buffer
    .toString()
    .split(LINE_BREAKS)
    .forEach((line) => {
      try {
        expect(line).toMatch(VALID_LINE);
      } catch (err) {
        const originalMessage = err?.message ?? 'Unknown error';
        err.message = `${ERROR_DESCRIPTION}\n\n${originalMessage}`;
        throw err;
      }
    });
};
export const testSchemaForDryRun = (
  appName: string,
  schema: Joi.ObjectSchema,
) => {
  const file = path.resolve(process.cwd(), `apps/${appName}/dry-run.env`);
  return testSchemaForDryRunFile(file, schema);
};

export const testAppEnvironmentConfig = (
  appName: string,
  schemas: Joi.ObjectSchema[],
) => {
  const schema = combineSchemas(schemas);

  it('has appropriate config for a dry run', () => {
    testSchemaForDryRun(appName, schema);
  });

  it('has appropriate config for local development', () => {
    testSchemaForEnv(schema, appName, 'development');
  });

  it('has appropriate config for testing', () => {
    testSchemaForEnv(schema, appName, 'test');
  });
};
