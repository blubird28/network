import { createMock } from '@golevelup/ts-jest';

import { ArgumentMetadata } from '@nestjs/common/interfaces/features/pipe-transform.interface';

import { PaginationDto } from '../dto/pagination.dto';
import { faker } from '../testing/data/fakers';
import { BaseException } from '../Error';
import { ErrorCode } from '../Error/constants';

import { BaseValidationPipe } from './BaseValidationPipe';

describe('BaseValidationPipe', function () {
  let pipe: BaseValidationPipe;
  let meta: ArgumentMetadata;
  beforeEach(() => {
    pipe = new BaseValidationPipe(PaginationDto);
    meta = createMock<ArgumentMetadata>();
  });

  it('transforms as expected', async () => {
    expect(await pipe.transform({}, meta)).toStrictEqual(
      faker(PaginationDto, {
        count: 20,
        skip: 0,
      }),
    );
  });

  it('handles errors as expected', async () => {
    try {
      await pipe.transform({ skip: -20 }, meta);
    } catch (err) {
      expect(err).toBeInstanceOf(BaseException);
      expect(err.code).toBe(ErrorCode.InvalidPagination);
      expect(err.message).toBe('common.invalid_pagination');
      return;
    }

    throw new Error('Expected an error');
  });
});
