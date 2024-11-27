import {
  FIRST_JAN_2020,
  FIRST_JAN_2020_STRING,
  FIRST_MAR_2020,
  FAKE_ISO8601_DATE,
  EMPTY_STRING,
  MOMENT_FORMATTED_FIRST_JAN_2020,
  MOMENT_FORMATTED_FIRST_JAN_2020_STRING,
  MOMENT_FORMATTED_FIRST_MAR_2020,
  DD_MM_YY_MOMENT_FORMATTED_FIRST_MAR_2020,
  MOMENT_FORMATTED_FAKE_ISO8601_DATE,
} from '../../testing/data/constants';

import formatDate from './formatDate';

describe('formatDate', () => {
  it('formats FIRST_JAN_2020 using moment to the "MMMM Do YYYY, hh:mm:ss a" format', () => {
    expect(formatDate(FIRST_JAN_2020, 'MMMM Do YYYY, hh:mm:ss a')).toBe(
      MOMENT_FORMATTED_FIRST_JAN_2020,
    );
  });

  it('formats FIRST_JAN_2020_STRING using moment to the "MMMM Do YYYY, hh:mm:ss a" format', () => {
    expect(formatDate(FIRST_JAN_2020_STRING, 'MMMM Do YYYY, hh:mm:ss a')).toBe(
      MOMENT_FORMATTED_FIRST_JAN_2020_STRING,
    );
  });

  it('formats FIRST_MAR_2020 using moment to the "MMMM Do YYYY, hh:mm:ss a" format', () => {
    expect(formatDate(FIRST_MAR_2020, 'MMMM Do YYYY, hh:mm:ss a')).toBe(
      MOMENT_FORMATTED_FIRST_MAR_2020,
    );
  });

  it('formats FIRST_MAR_2020 using moment to the "DD-MM-YYYY" format', () => {
    expect(formatDate(FIRST_MAR_2020, 'DD-MM-YYYY')).toBe(
      DD_MM_YY_MOMENT_FORMATTED_FIRST_MAR_2020,
    );
  });

  it('formats FAKE_ISO8601_DATE using moment to the "DD-MM-YYYY" format', () => {
    expect(formatDate(FAKE_ISO8601_DATE, 'DD-MM-YYYY')).toBe(
      MOMENT_FORMATTED_FAKE_ISO8601_DATE,
    );
  });

  it('tryies to format TEST using moment and fails', () => {
    expect(formatDate('TEST', 'DD-MM-YYYY')).toBe(EMPTY_STRING);
  });

  it('tryies to format 123456 using moment and fails', () => {
    expect(formatDate('123456', 'DD-MM-YYYY')).toBe(EMPTY_STRING);
  });

  it('tryies to format null using moment and fails', () => {
    expect(formatDate(null, 'DD-MM-YYYY')).toBe(EMPTY_STRING);
  });

  it('tryies to format undefined using moment and fails', () => {
    expect(formatDate(undefined, 'DD-MM-YYYY')).toBe(EMPTY_STRING);
  });
});
