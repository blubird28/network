import { StatusCodes } from 'http-status-codes';
import { isString } from 'lodash';
import { isAxiosError } from 'axios';

const NO_BLOCKS_FOUND = 'No suitable blocks found';

export const isIpBlockNotAvailableError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    if (status === StatusCodes.NOT_FOUND) {
      const msg = error.response?.data?.message ?? '';
      return isString(msg) && msg.includes(NO_BLOCKS_FOUND);
    }
  }
  return false;
};
