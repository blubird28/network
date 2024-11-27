import { appSchema } from '../schemas/app.schema';
import { identityServiceSchema } from '../schemas/identity-service.schema';
import { baseSchema } from '../schemas/base.schema';

import combineSchemas from './combineSchemas';

describe('combineSchemas', () => {
  it('with many schemas creates a schema combining all the provided schemas plus the base schema', () => {
    const result = combineSchemas([appSchema, identityServiceSchema]).validate(
      {},
      { abortEarly: false },
    );
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatchInlineSnapshot(
      `"\\"APP_NAME\\" is required. \\"APP_PORT\\" is required. \\"PUBSUB_PROJECT\\" is required. \\"IDENTITY_SERVICE_URL\\" is required"`,
    );
  });

  it('with 1 schema creates a schema combining it plus the base schema', () => {
    const result = combineSchemas([identityServiceSchema]).validate(
      {},
      { abortEarly: false },
    );
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toMatchInlineSnapshot(
      `"\\"APP_NAME\\" is required. \\"PUBSUB_PROJECT\\" is required. \\"IDENTITY_SERVICE_URL\\" is required"`,
    );
  });

  it('with no schemas provides the base schema', () => {
    const combined = combineSchemas();
    expect(combined).toBe(baseSchema);
  });
});
