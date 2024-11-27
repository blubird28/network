import { isString } from 'lodash';

export const getErrorMessage = (
  err: unknown,
  defaultMessage = 'Unknown error',
) => (isString(err?.['message']) ? err?.['message'] : defaultMessage);

export default getErrorMessage;
