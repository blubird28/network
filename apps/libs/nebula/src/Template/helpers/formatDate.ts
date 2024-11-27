import moment from 'moment';

import {
  EMPTY_STRING,
  JS_INVALID_DATE,
  MOMENT_INVALID_DATE,
} from '@libs/nebula/testing/data/constants';

const formatDate = (date: Date | string, format: string): string => {
  if (new Date(date).toString() === JS_INVALID_DATE) {
    return EMPTY_STRING;
  }
  const formatted = moment(date).format(format);

  return formatted === MOMENT_INVALID_DATE ? EMPTY_STRING : formatted;
};

export default formatDate;
