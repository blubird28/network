import { SubscriptionBaseDto } from '@libs/nebula/dto/subscription/subscription-base.dto';
import { faker } from '@libs/nebula/testing/data/fakers';

import convertSnakeCaseToCamelCase from '../../utils/data/convertSnakeCaseToCamelCase';

import convertCamelCaseToSnakeCase from './convertCamelCaseToSnakeCase';
const fakeSubscriptionBaseDto = faker(SubscriptionBaseDto);
describe('convertSnakeCaseToCamelCase', () => {
  it('should return camel case result', () => {
    expect.hasAssertions();
    const fakeSnakeCaseObject = convertCamelCaseToSnakeCase(
      fakeSubscriptionBaseDto,
    );
    const result = convertSnakeCaseToCamelCase(fakeSnakeCaseObject);
    expect(result).toEqual(fakeSubscriptionBaseDto);
  });
});
