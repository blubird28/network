import { AxiosError, AxiosHeaders } from 'axios';

import { HttpStatus } from '@nestjs/common';

import cleanAxiosError from '@libs/nebula/utils/data/cleanAxiosError';

describe('cleanAxiosError', () => {
  it('does nothing to normal errors', () => {
    expect.hasAssertions();

    const err = new Error('Computer says no');
    expect(cleanAxiosError(err)).toBe(err);
  });

  it('sanitizes axios errors', () => {
    expect.hasAssertions();

    const headers = new AxiosHeaders();
    const config = { headers };

    const err = new AxiosError(
      'Computer says no',
      'code',
      config,
      {},
      {
        data: {},
        config,
        headers,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        statusText: 'nope',
      },
    );
    const clean = cleanAxiosError(err) as AxiosError;
    expect(clean.message).toBe(err.message);
    expect(clean.stack).toBe(err.stack);
    expect(clean.config).toBeUndefined();
    expect(clean.request).toBeUndefined();
    expect(clean.response).toBeUndefined();
  });
});
