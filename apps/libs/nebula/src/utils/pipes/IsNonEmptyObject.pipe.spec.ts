import { ErrorCode } from '@libs/nebula/Error';

import { IsNonEmptyObjectPipe } from './IsNonEmptyObject.pipe';

describe('IsNonEmptyObjectPipe', () => {
  let pipe: IsNonEmptyObjectPipe;

  beforeEach(() => {
    pipe = new IsNonEmptyObjectPipe();
  });

  it('should throw an error if the value is null', () => {
    expect.hasAssertions();
    const value = null;
    expect(() => pipe.transform(value)).toThrow(ErrorCode.ValidationFailed);
  });

  it('should throw an error if the value is an empty object', () => {
    expect.hasAssertions();
    const value = {};
    expect(() => pipe.transform(value)).toThrow(ErrorCode.ValidationFailed);
  });

  it('should return the value if the value is an object with boolean values', () => {
    expect.hasAssertions();
    const value = { separateService: false };
    expect(pipe.transform(value)).toEqual(value);
  });

  it('should return the value if it is a non-empty object', () => {
    expect.hasAssertions();
    const value = { paymentTermDays: '30' };
    expect(pipe.transform(value)).toEqual(value);
  });
});
