import { crmPubSubSchema } from './crm-pub-sub.schema';

describe('configuration schema for CRM pubsub', () => {
  const fullConfig = {
    CRM_PUBSUB_PROJECT_ID: 'crm-project',
    CRM_PUBSUB_COMPANY_TOPIC: 'company-topic',
    CRM_PUBSUB_CONTACT_TOPIC: 'contact-topic',
    CRM_PUBSUB_COMPANY_RESPONSE_SUBSCRIPTION: 'company-response-subscription',
    CRM_PUBSUB_CONTACT_RESPONSE_SUBSCRIPTION: 'contact-response-subscription',
    CRM_PUBSUB_CUSTOMER_MASTER_TOPIC: 'customer-master-topic',
    CRM_PUBSUB_CUSTOMER_MASTER_SUBSCRIPTION: 'customer-master-subscription',
  };
  [
    'CRM_PUBSUB_PROJECT_ID',
    'CRM_PUBSUB_COMPANY_TOPIC',
    'CRM_PUBSUB_CONTACT_TOPIC',
    'CRM_PUBSUB_COMPANY_RESPONSE_SUBSCRIPTION',
    'CRM_PUBSUB_CONTACT_RESPONSE_SUBSCRIPTION',
    'CRM_PUBSUB_CUSTOMER_MASTER_TOPIC',
    'CRM_PUBSUB_CUSTOMER_MASTER_SUBSCRIPTION',
  ].forEach((key) => {
    it(`should throw for a missing ${key}`, () => {
      const result = crmPubSubSchema.validate({
        ...fullConfig,
        [key]: undefined,
      });
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe(`"${key}" is required`);
    });
  });

  it('gives us a valid configuration object', () => {
    expect.hasAssertions();

    const result = crmPubSubSchema.validate(fullConfig);

    expect(result.error).toBeUndefined();
    expect(result.value).toStrictEqual(fullConfig);
  });
});
