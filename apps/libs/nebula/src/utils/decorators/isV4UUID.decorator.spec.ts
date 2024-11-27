import * as classValidator from 'class-validator';

import { IsV4UUID } from './isV4UUID.decorator';

jest.mock('class-validator');
const mockIsUuid = jest.mocked(classValidator.IsUUID);
describe('IsV4UUID decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the class-validator decorator with the version specified', () => {
    expect.hasAssertions();

    IsV4UUID();

    expect(mockIsUuid).toBeCalledWith(4, undefined);
  });
  it('calls the class-validator decorator with the version specified and any validation options passed', () => {
    expect.hasAssertions();

    const validationOptions = { context: 'context' };

    IsV4UUID(validationOptions);

    expect(mockIsUuid).toBeCalledWith(4, validationOptions);
  });
});
