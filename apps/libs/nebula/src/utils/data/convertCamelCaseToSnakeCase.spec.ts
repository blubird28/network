import { faker } from '@libs/nebula/testing/data/fakers';
import { SubscriptionBaseDto } from '@libs/nebula/dto/subscription/subscription-base.dto';

import convertCamelCaseToSnakeCase from '../../utils/data/convertCamelCaseToSnakeCase';
const fakeSubscriptionBaseDto = faker(SubscriptionBaseDto);

describe('convertCamelCaseToSnakeCase', () => {
  it('should return snake case result', () => {
    expect.hasAssertions();
    const fakeSnakeCaseObject = convertCamelCaseToSnakeCase(
      fakeSubscriptionBaseDto,
    );
    const result = convertCamelCaseToSnakeCase(fakeSubscriptionBaseDto);
    expect(result).toStrictEqual(fakeSnakeCaseObject);
  });
});
