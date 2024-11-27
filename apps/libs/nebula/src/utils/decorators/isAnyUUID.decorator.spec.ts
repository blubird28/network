import * as classValidator from 'class-validator';

import { IsAnyUUID } from './isAnyUUID.decorator';

jest.mock('class-validator');
const mockIsUuid = jest.mocked(classValidator.IsUUID);
describe('IsAnyUUID decorator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls the class-validator decorator with the version specified', () => {
    expect.hasAssertions();

    IsAnyUUID();

    expect(mockIsUuid).toBeCalledWith('all', undefined);
  });
  it('calls the class-validator decorator with the version specified and any validation options passed', () => {
    expect.hasAssertions();

    const validationOptions = { context: 'context' };

    IsAnyUUID(validationOptions);

    expect(mockIsUuid).toBeCalledWith('all', validationOptions);
  });
});
