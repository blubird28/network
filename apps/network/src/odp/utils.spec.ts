import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { set } from 'lodash';
import { AxiosError } from 'axios';

import { isIpBlockNotAvailableError } from './utils';

describe('odp utils', () => {
  it('detects a "No Suitable Blocks" response from 6connect', () => {
    expect.hasAssertions();

    const targetError = new AxiosError(
      'Not Found',
      ReasonPhrases[StatusCodes.NOT_FOUND],
      null,
      null,
      {
        statusText: ReasonPhrases[StatusCodes.NOT_FOUND],
        config: null,
        headers: {},
        request: {},
        status: StatusCodes.NOT_FOUND,
        data: {
          message: 'No suitable blocks found for mask size /28',
        },
      },
    );
    const otherAxiosError = new AxiosError(
      'Not Found',
      ReasonPhrases[StatusCodes.NOT_FOUND],
      null,
      null,
      {
        statusText: ReasonPhrases[StatusCodes.NOT_FOUND],
        config: null,
        headers: {},
        request: {},
        status: StatusCodes.NOT_FOUND,
        data: {
          message: 'Could not resolve hostname',
        },
      },
    );
    const otherError = new Error('No suitable blocks found for mask size /28');
    set(otherError, 'response', {
      status: StatusCodes.NOT_FOUND,
    });

    expect(isIpBlockNotAvailableError(targetError)).toBe(true);
    expect(isIpBlockNotAvailableError(otherAxiosError)).toBe(false);
    expect(isIpBlockNotAvailableError(null)).toBe(false);
    expect(isIpBlockNotAvailableError(undefined)).toBe(false);
    expect(isIpBlockNotAvailableError(true)).toBe(false);
    expect(isIpBlockNotAvailableError(42)).toBe(false);
    expect(isIpBlockNotAvailableError([])).toBe(false);
    expect(isIpBlockNotAvailableError({})).toBe(false);
    expect(isIpBlockNotAvailableError(otherError)).toBe(false);
  });
});
