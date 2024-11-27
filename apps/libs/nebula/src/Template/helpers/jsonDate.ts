import { isDate } from 'lodash';

const jsonDate = (date: Date | string): string =>
  isDate(date) ? date.toJSON() : date;

export default jsonDate;
